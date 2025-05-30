import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { ITruckService } from "./interface/ITruckService";
import { PaginatedTrucksResult } from "../../types/wastePlant/truckTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository 
  ){}
  async addTruck(data: ITruck): Promise<ITruck> {
    const existingVehicleNo = await this.truckRepository.findTruckByVehicle(
      data.vehicleNumber
    );
    if (existingVehicleNo) {
      throw new Error("Vehicle number already exists");
    }

    const newData: ITruck = {
      ...data,
    };
    return await this.truckRepository.createTruck(newData);
  }
  async getAllTrucks(plantId: string, page: number, limit: number, search: string): Promise<PaginatedTrucksResult> {
    return await this.truckRepository.getAllTrucks(plantId, page, limit, search);
  }
  async getAvailableTrucksService(driverId: string, plantId: string): Promise<ITruck[]> {
    return await this.truckRepository.getAvailableTrucks(driverId, plantId);
  }
  async getTruckByIdService(truckId: string): Promise<ITruck | null> {
    try {
      return await this.truckRepository.getTruckById(truckId);
    } catch (error) {
      throw new Error("Error fetching truck from service");
    }
  }

  async updateTruckByIdService(
    truckId: string,
    data: any
  ): Promise<ITruck | null> {
    try {
      return await this.truckRepository.updateTruckById(truckId, data);
    } catch (error) {
      throw new Error("Error updating truck in service");
    }
  }

  async deleteTruckByIdService(truckId: string) {
    return await this.truckRepository.deleteTruckById(truckId);
  }

  async pendingTruckReqsts(plantId: string): Promise<any> {
    try {
      return await this.truckRepository.getMaintainanceTrucks(plantId);
    } catch (error) {
      throw new Error("Error fetching pending truck reqsts from service");
    }
  }

  async availableTrucksForDriver(plantId: string): Promise<any> {
    try {
      return await this.truckRepository.activeAvailableTrucks(plantId);
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
    const truck = await this.truckRepository.getTruckById(truckId);
    if (!truck || truck.status !== "Active") {
      throw new Error("Selected truck is not available");
    }
    const updatedRequest = await this.truckRepository.assignTruckToDriver(
      plantId,
      driverId,
      truckId,
      prevTruckId
    );
    return updatedRequest;
  }
}

