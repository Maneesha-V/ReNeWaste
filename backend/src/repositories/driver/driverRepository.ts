import { Types } from "mongoose";
import { DriverModel } from "../../models/driver/driverModel";
import {
  IDriver,
  IDriverDocument,
} from "../../models/driver/interfaces/driverInterface";
import { IDriverRepository } from "./interface/IDriverRepository";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import BaseRepository from "../baseRepository/baseRepository";
import { ITruckRepository } from "../truck/interface/ITruckRepository";
import { INotificationRepository } from "../notification/interface/INotifcationRepository";
import { MarkTruckReturnResult, PaginatedDriversResult, ReturnFetchAllDriversByPlantId } from "../../dtos/driver/driverDTO";
import { DriverMapper } from "../../mappers/DriverMapper";

@injectable()
export class DriverRepository
  extends BaseRepository<IDriverDocument>
  implements IDriverRepository
{
  constructor(
    @inject(TYPES.TruckRepositoryFactory)
    private getTruckRepo: () => ITruckRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository
  ) {
    super(DriverModel);
  }
  async createDriver(data: IDriver): Promise<IDriverDocument> {
      const driver = new this.model(data);
      console.log("driver", driver);
      return await driver.save();
  }
  async findDriverByEmail(email: string): Promise<IDriverDocument | null> {
    return await this.model.findOne({ email });
  }
  async findDriverByName(name: string): Promise<IDriverDocument | null> {
    return await this.model.findOne({ name });
  }
  async findDriverByLicense(licenseNumber: string): Promise<IDriver | null> {
    return await this.model.findOne({ licenseNumber });
  }
  async getAllDrivers(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedDriversResult> {
    const searchRegex = new RegExp(search, "i");

    const query: any = {
      wasteplantId: plantId,
      isDeleted: false,
      $or: [
        { name: { $regex: searchRegex } },
        { licenseNumber: { $regex: searchRegex } },
        { contact: { $regex: searchRegex } },
      ],
    };
    if (!isNaN(Number(search))) {
      query.$or.push({ experience: Number(search) });
    }

    const skip = (page - 1) * limit;

    const drivers = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);

    return { 
      drivers: DriverMapper.mapDriversDTO(drivers), 
      total 
    };
  }
  async updateDriverPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
  async getDriverById(driverId: string) {
    return await this.model.findById(driverId);
  }
  async updateDriverById(driverId: string, data: any): Promise<IDriverDocument | null> {
    return await this.model.findByIdAndUpdate(driverId, data, { new: true });
  }
  async deleteDriverById(driverId: string) {
    const updatedDriver = await this.model.findByIdAndUpdate(
      driverId,
      { isDeleted: true, status: "Inactive" },
      { new: true }
    );
    if (!updatedDriver) {
      throw new Error("Driver not found.");
    }
    return updatedDriver;
  }
  async fetchDriversByPlantId(wastePlantId: string) {
    const objectId = new Types.ObjectId(wastePlantId);
    return await this.model
      .find({
        wasteplantId: objectId,
        status: "Active",
      })
      .sort({ name: 1 });
  }
  async updateDriverTruck(driverId: string, assignedTruckId: string) {
    const objectIdDriver = new Types.ObjectId(driverId);
    const objectIdTruck = new Types.ObjectId(assignedTruckId);
    await this.getTruckRepo().updateAssignedDriver(
      assignedTruckId,
      objectIdDriver
    );
    return await this.model.findByIdAndUpdate(
      objectIdDriver,
      {
        $set: {
          assignedTruckId: objectIdTruck,
        },
      },
      { new: true }
    );
  }
  async updateDriverAssignedZone(driverId: string, assignedZone: string) {
    const objectId = new Types.ObjectId(driverId);
    return await this.model.findByIdAndUpdate(
      objectId,
      {
        $set: {
          assignedZone: assignedZone,
        },
      },
      { new: true }
    );
  }

  async getDriversByLocation(location: string, plantId: string) {
    const objectId = new Types.ObjectId(plantId);
    return await this.model
      .find({
        wasteplantId: objectId,
        assignedZone: location,
      })
      .sort({ name: 1 });
  }

  async updateDriverByPlantAndId(
    driverId: string,
    plantId: string,
    updateData: Partial<IDriver>
  ): Promise<IDriver | null> {
    return await this.model.findOneAndUpdate(
      {
        _id: driverId,
        wasteplantId: plantId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );
  }
  async countAll(): Promise<number> {
    return await this.model.countDocuments();
  }
  async markTruckAsReturned(
    truckId: string,
    plantId: string,
    driverId: string
  ): Promise<MarkTruckReturnResult> {
    const driver = await this.model.findById(driverId);
    if (!driver) {
      throw new Error("Driver not found.");
    }
    if (!driver.wasteplantId || driver.wasteplantId.toString() !== plantId) {
      throw new Error("Unauthorized plant.");
    }
    driver.assignedTruckId = null;
    await driver.save();

    const truck = await this.getTruckRepo().markTruckAsReturned(
      driverId,
      truckId,
      plantId
    );

    const message = `Truck ${truck?.vehicleNumber} returned by driver ${driver.name}`;
    const notification = await this.notificationRepository.createNotification({
      receiverId: plantId,
      receiverType: "wasteplant",
      senderId: driverId,
      senderType: "driver",
      message,
      type: "truck_returned",
    });
    console.log("notification", notification);

    const io = globalThis.io;

    if (io) {
      io.to(`${plantId}`).emit("newNotification", notification);
    }

    return { driver, truck };
  }
  async fetchAllDriversByPlantId(
    wastePlantId: string
  ): Promise<ReturnFetchAllDriversByPlantId> {
    const driverCounts = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new Types.ObjectId(wastePlantId),
          isDeleted: false
        },
      },
      {
        $group: {
          _id: "$status",
          totalCount: { $sum: 1 },
        },
      },
    ]);
    let active = 0;
    let inactive = 0;
    let suspended = 0;
    for (const record of driverCounts) {
      if (record._id === "Active") {
        active = record.totalCount;
      } else if (record._id === "Inactive") {
        inactive = record.totalCount;
      } else if (record._id === "Suspended") {
        suspended = record.totalCount;
      }
    }

    return { active, inactive, suspended };
  }
  async getTotalDrivers(): Promise<number> {
    return await this.model.countDocuments();
  }
}
