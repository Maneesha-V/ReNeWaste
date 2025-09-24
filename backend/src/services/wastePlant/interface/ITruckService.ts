import {
  PaginatedResult,
  TruckAvailbleDTO,
  TruckDTO,
} from "../../../dtos/truck/truckDTO";
import { ITruck } from "../../../models/truck/interfaces/truckInterface";

export interface ITruckService {
  addTruck(data: ITruck): Promise<boolean>;
  getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedResult>;
  getAvailableTrucksService(
    driverId: string,
    plantId: string,
  ): Promise<TruckAvailbleDTO[]>;
  getTruckByIdService(truckId: string): Promise<TruckDTO>;
  updateTruckByIdService(truckId: string, data: ITruck): Promise<TruckDTO>;
  deleteTruckByIdService(truckId: string): Promise<TruckDTO>;
  pendingTruckReqsts(plantId: string): Promise<TruckDTO[]>;
  availableTrucksForDriver(plantId: string): Promise<TruckDTO[]>;
  assignTruckToDriverService(
    plantId: string,
    driverId: string,
    truckId: string,
    prevTruckId: string,
  ): Promise<TruckDTO[]>;
}
