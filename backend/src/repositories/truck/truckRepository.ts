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
  async findTruckByVehicle(vehicleNumber: string): Promise<ITruck | null> {
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
    // return await TruckModel.find({wasteplantId: plantId});
  }
  async getAvailableTrucks(driverId: string): Promise<ITruck[]> {
    const existingTruck = await this.model
      .findOne({
        assignedDriver: driverId,
      })
      .populate("wasteplantId");
    if (existingTruck) {
      return [existingTruck];
    }
    // return [];
    return await this.model
      .find({ assignedDriver: null })
      .populate("wasteplantId");
  }
  async getTruckById(truckId: string) {
    return await this.model.findById(truckId);
  }
  async updateTruckById(truckId: string, data: any): Promise<ITruck | null> {
    return await this.model.findByIdAndUpdate(truckId, data, { new: true });
  }
  async deleteTruckById(truckId: string) {
    return await this.model.findByIdAndDelete(truckId);
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
      },
    });
  }
  async countAll(): Promise<number> {
    return await this.model.countDocuments();
  }
}
