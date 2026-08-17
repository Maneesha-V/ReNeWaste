import { ITruck } from "../../models/truck/interfaces/truckInterface";
import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import {
  PaginatedResult,
  TruckAvailbleDTO,
  TruckDTO,
} from "../../dtos/truck/truckDTO";
import { TruckMapper } from "../../mappers/TruckMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.WastePlantRepository)
    private wasteplantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionplanRepository: ISubscriptionPlanRepository,
  ) {}
  async addTruck(data: ITruck): Promise<boolean> {
    const trucksCount = await this.truckRepository.fetchAllTrucksByPlantId(
      data.wasteplantId!.toString(),
    );
    const totalTruckCount =
      trucksCount.active + trucksCount.inactive + trucksCount.maintenance;
    const plant = await this.wasteplantRepository.getWastePlantById(
      data.wasteplantId!.toString(),
    );
    if (!plant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    if (plant.status === "Active") {
      const purchasedPlan =
        await this.subscriptionplanRepository.checkPlanNameExist(
          plant.subscriptionPlan!,
        );
      if (!purchasedPlan) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.SUPERADMIN.ERROR.PLAN_NOT_EXIST,
        );
      }
      if (totalTruckCount >= purchasedPlan?.truckLimit) {
        throw new ApiError(
          STATUS_CODES.CONFLICT,
          `You can't add new truck bcoz your plan truck limit is ${purchasedPlan?.truckLimit}.`,
        );
      }
    }
    const existingVehicleNo = await this.truckRepository.findTruckByVehicle(
      data.vehicleNumber,
    );
    if (existingVehicleNo) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.WASTEPLANT.ERROR.VEHICLE_NUM_EXISTS,
      );
    }

    const newData: ITruck = {
      ...data,
    };
    const created = await this.truckRepository.createTruck(newData);
    if (!created) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_FAIL_CREATE,
      );
    }
    return true;
  }
  async getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedResult> {
    const { trucks, total } = await this.truckRepository.getAllTrucks(
      plantId,
      page,
      limit,
      search,
    );
    return {
      trucks: TruckMapper.mapTrucksDTO(trucks),
      total,
    };
  }
  async getAvailableTrucksService(
    driverId: string,
    plantId: string,
  ): Promise<TruckAvailbleDTO[]> {
    const trucks = await this.truckRepository.getAvailableTrucks(
      driverId,
      plantId,
    );

    return TruckMapper.mapAvailableTrucksDTO(trucks);
  }
  async getTruckByIdService(truckId: string): Promise<TruckDTO> {
    const truck = await this.truckRepository.getTruckById(truckId);
    if (!truck) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_FOUND,
      );
    }
    return TruckMapper.mapTruckDTO(truck);
  }

  async updateTruckByIdService(
    truckId: string,
    data: ITruck,
  ): Promise<TruckDTO> {
    const truck = await this.truckRepository.updateTruckById(truckId, data);
    if (!truck) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_FOUND,
      );
    }
    return TruckMapper.mapTruckDTO(truck);
  }

  async deleteTruckByIdService(truckId: string) {
    const truck = await this.truckRepository.deleteTruckById(truckId);
    if (!truck) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_FOUND,
      );
    }
    return TruckMapper.mapTruckDTO(truck);
  }

  async pendingTruckReqsts(plantId: string): Promise<TruckDTO[]> {
    const trucks = await this.truckRepository.getMaintainanceTrucks(plantId);
    return TruckMapper.mapTrucksDTO(trucks);
  }

  async availableTrucksForDriver(plantId: string): Promise<TruckDTO[]> {
    const trucks = await this.truckRepository.activeAvailableTrucks(plantId);
    return TruckMapper.mapTrucksDTO(trucks);
  }
  async assignTruckToDriverService(
    plantId: string,
    driverId: string,
    truckId: string,
    prevTruckId: string,
  ): Promise<TruckDTO[]> {
    const truck = await this.truckRepository.getTruckById(truckId);
    if (!truck) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_FOUND,
      );
    }
    if (truck.status !== "Active") {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.TRUCK_NOT_AVAILABLE,
      );
    }
    const updatedRequest = await this.truckRepository.assignTruckToDriver(
      plantId,
      driverId,
      truckId,
      prevTruckId,
    );
    return TruckMapper.mapTrucksDTO(updatedRequest);
  }
}
