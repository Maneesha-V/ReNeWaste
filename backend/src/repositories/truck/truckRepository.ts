import { DriverModel } from "../../models/driver/driverModel";
import {
  ITruck,
  ITruckDocument,
} from "../../models/truck/interfaces/truckInterface";
import { TruckModel } from "../../models/truck/truckModel";
import { PaginatedTrucksResult } from "../../types/wastePlant/truckTypes";
import { ITruckRepository } from "./interface/ITruckRepository";

class TruckRepository implements ITruckRepository {
  async findTruckByVehicle(vehicleNumber: string): Promise<ITruck | null> {
    return await TruckModel.findOne({ vehicleNumber });
  }
  async createTruck(data: ITruck): Promise<ITruckDocument> {
    try {
      const truck = new TruckModel(data);
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
    console.log("search",search);
    
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

    const trucks = await TruckModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await TruckModel.countDocuments(query);

    return { trucks, total };
    // return await TruckModel.find({wasteplantId: plantId});
  }
  async getAvailableTrucks(driverId: string): Promise<ITruck[]> {
    const existingTruck = await TruckModel.findOne({
      assignedDriver: driverId,
    }).populate("wasteplantId");
    if (existingTruck) {
      return [existingTruck];
    }
    // return [];
    return await TruckModel.find({ assignedDriver: null }).populate(
      "wasteplantId"
    );
  }
  async getTruckById(truckId: string) {
    return await TruckModel.findById(truckId);
  }
  async updateTruckById(truckId: string, data: any): Promise<ITruck | null> {
    return await TruckModel.findByIdAndUpdate(truckId, data, { new: true });
  }
  async deleteTruckById(truckId: string) {
    return await TruckModel.findByIdAndDelete(truckId);
  }

  async reqTruckToWastePlant(driverId: string) {
    return await DriverModel.findByIdAndUpdate(driverId, {
      hasRequestedTruck: true,
    });
  }
  async getMaintainanceTrucks(plantId: string) {
    const trucks = await TruckModel.find({
      wasteplantId: plantId,
      status: "Maintenance",
    }).populate("assignedDriver");
    return trucks.filter((truck) => truck.assignedDriver !== null);
  }

  async activeAvailableTrucks(plantId: string) {
    return await TruckModel.find({
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
    const updatedDriver = await DriverModel.findOneAndUpdate(
      { _id: driverId, wasteplantId: plantId },
      {
        $set: {
          assignedTruckId: truckId,
          hasRequestedTruck: false,
        },
      },
      { new: true }
    );
    const updatedTruck = await TruckModel.findOneAndUpdate(
      { _id: truckId },
      {
        $set: {
          assignedDriver: driverId,
        },
      },
      { new: true }
    );
    if (prevTruckId && prevTruckId !== truckId) {
      await TruckModel.findOneAndUpdate(
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
}
export default new TruckRepository();
