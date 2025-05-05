import { DriverModel } from "../../models/driver/driverModel";
import {
  ITruck,
  ITruckDocument,
} from "../../models/truck/interfaces/truckInterface";
import { TruckModel } from "../../models/truck/truckModel";
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
  async getAllTrucks(): Promise<ITruck[]> {
    return await TruckModel.find();
  }
  async getAvailableTrucks(driverId: string): Promise<ITruck[]> {
    const existingTruck = await TruckModel.findOne({ assignedDriver: driverId }).populate('wasteplantId');
    if (existingTruck) {
      return [existingTruck]; 
    }
  
    return [];
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

}
export default new TruckRepository();
