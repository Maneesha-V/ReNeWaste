import TruckRepository from "../../repositories/truck/truckRepository";
import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { ITruckService } from "./interface/ITruckService";
import WastePlantRepository from "../../repositories/wastePlant/wastePlantRepository";
import { PaginatedTrucksResult } from "../../types/wastePlant/truckTypes";

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
  async getAllTrucks(plantId: string, page: number, limit: number, search: string): Promise<PaginatedTrucksResult> {
    return await TruckRepository.getAllTrucks(plantId, page, limit, search);
  }
  async getAvailableTrucksService(driverId: string): Promise<ITruck[]> {
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
    return await TruckRepository.deleteTruckById(truckId);
  }

  async pendingTruckReqsts(plantId: string): Promise<any> {
    try {
      return await TruckRepository.getMaintainanceTrucks(plantId);
    } catch (error) {
      throw new Error("Error fetching pending truck reqsts from service");
    }
  }

  async availableTrucksForDriver(plantId: string): Promise<any> {
    try {
      return await TruckRepository.activeAvailableTrucks(plantId);
    } catch (error) {
      throw new Error("Error fetching trucks from service");
    }
  }
  async assignTruckToDriverService(
    plantId: string,
    driverId: string,
    truckId: string,
    prevTruckId: string
  ): Promise<any> {
    const truck = await TruckRepository.getTruckById(truckId);
    if (!truck || truck.status !== "Active") {
      throw new Error("Selected truck is not available");
    }
    const updatedRequest = await TruckRepository.assignTruckToDriver(
      plantId,
      driverId,
      truckId,
      prevTruckId
    );
    return updatedRequest;
  }
}
export default new TruckService();
