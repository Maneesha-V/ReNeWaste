import TruckRepository from "../../repositories/truck/truckRepository";
import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { ITruckService } from "./interface/ITruckService";
import  WastePlantRepository  from "../../repositories/wastePlant/wastePlantRepository";

class TruckService implements ITruckService {
  async addTruck(data: ITruck): Promise<ITruck> {
    const existingVehicleNo = await TruckRepository.findTruckByVehicle(
      data.vehicleNumber
    );
    if (existingVehicleNo) {
      throw new Error("Vehicle number already exists");
    }

    const newData: ITruck = {
      ...data,
    };
    return await TruckRepository.createTruck(newData);
  }
  async getAllTrucks(plantId: string): Promise<ITruck[]> {
    return await TruckRepository.getAllTrucks(plantId);
  }
  async getAvailableTrucks( driverId: string): Promise<ITruck[]> {
    return await TruckRepository.getAvailableTrucks(driverId);
  }
  async getTruckByIdService(truckId: string): Promise<ITruck | null> {
    try {
      return await TruckRepository.getTruckById(truckId);
    } catch (error) {
      throw new Error("Error fetching truck from service");
    }
  }

  async updateTruckByIdService(
    truckId: string,
    data: any
  ): Promise<ITruck | null> {
    try {
      return await TruckRepository.updateTruckById(truckId, data);
    } catch (error) {
      throw new Error("Error updating truck in service");
    }
  }

    async deleteTruckByIdService(truckId: string) {
      return await  TruckRepository.deleteTruckById(truckId)
    }
    
    async pendingTruckReqsts(plantId: string): Promise<any> {
      try {
        return await TruckRepository.getMaintainanceTrucks(plantId);
      } catch (error) {
        throw new Error("Error fetching pending truck reqsts from service");
      }
    }
}
export default new TruckService();
