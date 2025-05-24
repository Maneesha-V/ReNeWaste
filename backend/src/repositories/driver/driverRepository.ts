import { Types } from "mongoose";
import { DriverModel } from "../../models/driver/driverModel";
import {
  IDriver,
  IDriverDocument,
} from "../../models/driver/interfaces/driverInterface";
import { IDriverRepository } from "./interface/IDriverRepository";
import { PaginatedDriversResult } from "../../types/wastePlant/driverTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import BaseRepository from "../baseRepository/baseRepository";
import { ITruckRepository } from "../truck/interface/ITruckRepository";

@injectable()
export class DriverRepository
  extends BaseRepository<IDriverDocument>
  implements IDriverRepository
{
  constructor(
    @inject(TYPES.TruckRepositoryFactory)
    private getTruckRepo: () => ITruckRepository
  ) {
    super(DriverModel);
  }
  async createDriver(data: IDriver): Promise<IDriverDocument> {
    try {
      const driver = new this.model(data);
      console.log("driver", driver);
      return await driver.save();
    } catch (error: any) {
      console.error("MongoDB Insert Error:", error);
      throw error;
    }
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

    return { drivers, total };
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
  async updateDriverById(driverId: string, data: any): Promise<IDriver | null> {
    return await this.model.findByIdAndUpdate(driverId, data, { new: true });
  }
  async deleteDriverById(driverId: string) {
    return await this.model.findByIdAndDelete(driverId);
  }
  async fetchDrivers(wastePlantId: string) {
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
}
