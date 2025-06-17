import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { ITruckService } from "./interface/ITruckService";
import { PaginatedTrucksResult } from "../../types/wastePlant/truckTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.WastePlantRepository)
    private wasteplantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionplanRepository: ISubscriptionPlanRepository
  ) {}
  async addTruck(data: ITruck): Promise<ITruck> {
    const trucksCount = await this.truckRepository.fetchAllTrucksByPlantId(
      data.wasteplantId!.toString()
    );
    const totalTruckCount =
      trucksCount.active + trucksCount.inactive + trucksCount.maintenance;
    const plant = await this.wasteplantRepository.getWastePlantById(
      data.wasteplantId!.toString()
    );
    if (!plant) {
      throw new Error("Plant not found.");
    }
    if (plant.status === "Active") {
      const purchasedPlan =
        await this.subscriptionplanRepository.checkPlanNameExist(
          plant.subscriptionPlan!
        );
      if (!purchasedPlan) {
        throw new Error("Subscription plan not found.");
      }
      if (totalTruckCount >= purchasedPlan?.truckLimit) {
        throw new Error(
          `You can't add new truck bcoz your plan truck limit is ${purchasedPlan?.truckLimit}.`
        );
      }
    }
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
  async getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedTrucksResult> {
    return await this.truckRepository.getAllTrucks(
      plantId,
      page,
      limit,
      search
    );
  }
  async getAvailableTrucksService(
    driverId: string,
    plantId: string
  ): Promise<ITruck[]> {
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
