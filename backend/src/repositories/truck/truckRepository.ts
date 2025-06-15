import {
  ITruck,
  ITruckDocument,
} from "../../models/truck/interfaces/truckInterface";
import { TruckModel } from "../../models/truck/truckModel";
import { PaginatedTrucksResult } from "../../types/wastePlant/truckTypes";
import { ITruckRepository } from "./interface/ITruckRepository";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import BaseRepository from "../baseRepository/baseRepository";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import { Types } from "mongoose";
import { ReturnFetchAllTrucksByPlantId } from "./types/truckTypes";

@injectable()
export class TruckRepository
  extends BaseRepository<ITruckDocument>
  implements ITruckRepository
{
  constructor(
    @inject(TYPES.DriverRepository)
    private getDriverRepo: () => IDriverRepository
  ) {
    super(TruckModel);
  }
  async findTruckByVehicle(
    vehicleNumber: string
  ): Promise<ITruckDocument | null> {
    return await this.model.findOne({ vehicleNumber });
  }
  async createTruck(data: ITruck): Promise<ITruckDocument> {
    try {
      const truck = new this.model(data);
      console.log("db-truck", truck);
      return await truck.save();
    } catch (error: any) {
      console.error("MongoDB Insert Error:", error);
      throw error;
    }
  }
  async getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedTrucksResult> {
    console.log("search", search);

    const searchRegex = new RegExp(search, "i");

    const query: any = {
      wasteplantId: plantId,
      isDeleted: false,
      $or: [
        { name: { $regex: searchRegex } },
        { vehicleNumber: { $regex: searchRegex } },
        { status: { $regex: searchRegex } },
      ],
    };
    if (!isNaN(Number(search))) {
      query.$or.push({ capacity: Number(search) });
    }

    const skip = (page - 1) * limit;

    const trucks = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);

    return { trucks, total };
  }
  async getAvailableTrucks(
    driverId: string,
    plantId: string
  ): Promise<ITruck[]> {
    const existingTruck = await this.model
      .findOne({
        assignedDriver: driverId,
        wasteplantId: plantId,
      })
      .populate("wasteplantId");
    if (existingTruck) {
      return [existingTruck];
    }

    return await this.model
      .find({ assignedDriver: null, wasteplantId: plantId })
      .populate("wasteplantId");
  }
  async getTruckById(truckId: string) {
    return await this.model.findById(truckId);
  }
  async updateTruckById(truckId: string, data: any): Promise<ITruck | null> {
    return await this.model.findByIdAndUpdate(truckId, data, { new: true });
  }
  async deleteTruckById(truckId: string) {
    const updatedTruck = await this.model.findByIdAndUpdate(
      truckId,
      {isDeleted: true, status: "Inactive"},
      {new: true}
    )
    if(!updatedTruck){
      throw new Error("Truck not found.")
    }
    return updatedTruck;
  }

  async reqTruckToWastePlant(driverId: string) {
    return await this.getDriverRepo().updateDriverById(driverId, {
      hasRequestedTruck: true,
    });
  }
  async getMaintainanceTrucks(plantId: string) {
    const trucks = await this.model
      .find({
        wasteplantId: plantId,
        status: "Maintenance",
      })
      .populate("assignedDriver");
    return trucks.filter((truck) => truck.assignedDriver !== null);
  }

  async activeAvailableTrucks(plantId: string) {
    return await this.model.find({
      wasteplantId: plantId,
      status: "Active",
      assignedDriver: null,
    });
  }
  async assignTruckToDriver(
    plantId: string,
    driverId: string,
    truckId: string,
    prevTruckId: string
  ) {
    const updatedDriver = await this.getDriverRepo().updateDriverByPlantAndId(
      driverId,
      plantId,
      {
        assignedTruckId: new Types.ObjectId(truckId),
        hasRequestedTruck: false,
      }
    );
    const updatedTruck = await this.model.findOneAndUpdate(
      { _id: truckId },
      {
        $set: {
          assignedDriver: driverId,
        },
      },
      { new: true }
    );
    if (prevTruckId && prevTruckId !== truckId) {
      await this.model.findOneAndUpdate(
        { _id: prevTruckId },
        {
          $set: {
            assignedDriver: null,
          },
        }
      );
    }
    return await this.getMaintainanceTrucks(plantId);
  }

  async updateAssignedDriver(
    truckId: string,
    driverId: string | Types.ObjectId
  ): Promise<void> {
    const objectIdTruck = new Types.ObjectId(truckId);
    const objectIdDriver =
      typeof driverId === "string" ? new Types.ObjectId(driverId) : driverId;

    await this.model.findByIdAndUpdate(objectIdTruck, {
      $set: {
        assignedDriver: objectIdDriver,
        isReturned: false,
      },
    });
  }
  async countAll(): Promise<number> {
    return await this.model.countDocuments();
  }
  async markTruckAsReturned(
    driverId: string,
    truckId: string,
    plantId: string
  ): Promise<ITruckDocument> {
    const truck = await this.model.findOneAndUpdate(
      { _id: truckId, assignedDriver: driverId, wasteplantId: plantId },
      {
        $set: { isReturned: true, assignedDriver: null },
      },
      { new: true }
    );
    if (!truck) {
      throw new Error("Truck not found or not assigned to this driver");
    }
    return truck;
  }
  async findTruckByName(name: string): Promise<ITruckDocument | null> {
    return await this.model.findOne({ name });
  }
  async fetchAllTrucksByPlantId(
    plantId: string
  ): Promise<ReturnFetchAllTrucksByPlantId> {
    const truckCounts = await this.model.aggregate([
      {
        $match: {
          wasteplantId: new Types.ObjectId(plantId),
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
    let maintenance = 0;
    for (const record of truckCounts) {
      if (record._id === "Active") {
        active = record.totalCount;
      } else if (record._id === "Inactive") {
        inactive = record.totalCount;
      } else if (record._id === "Maintenance") {
        maintenance = record.totalCount;
      }
    }

    return { active, inactive, maintenance };
  }
}
