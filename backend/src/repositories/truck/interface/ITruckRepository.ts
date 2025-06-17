import { Types } from "mongoose";
import {
  ITruck,
  ITruckDocument,
} from "../../../models/truck/interfaces/truckInterface";
import { PaginatedTrucksResult } from "../../../types/wastePlant/truckTypes";
import { ReturnFetchAllTrucksByPlantId } from "../types/truckTypes";

export interface ITruckRepository {
  findTruckByVehicle(vehicleNumber: string): Promise<ITruckDocument | null>;
  createTruck(data: ITruck): Promise<ITruckDocument>;
  getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedTrucksResult>;
  getAvailableTrucks(driverId: string, plantId: string): Promise<ITruck[]>;
  getAssignedAvailableTrucks(driverId: string, plantId: string): Promise<ITruck[] | null> 
  getTruckById(truckId: string): Promise<ITruckDocument | null>;
  updateTruckById(truckId: string, data: any): Promise<ITruck | null>;
  deleteTruckById(truckId: string): Promise<ITruckDocument | null>;
  reqTruckToWastePlant(driverId: string): Promise<any>;
  getMaintainanceTrucks(plantId: string): Promise<any>;
  activeAvailableTrucks(plantId: string): Promise<ITruckDocument[]>;
  assignTruckToDriver(
    plantId: string,
    driverId: string,
    truckId: string,
    prevTruckId: string
  ): Promise<ITruckDocument[]>;
  updateAssignedDriver(
    truckId: string,
    driverId: string | Types.ObjectId
  ): Promise<void>;
  countAll(): Promise<number>;
    markTruckAsReturned(
    driverId: string,
    truckId: string,
    plantId: string
  ): Promise<ITruckDocument>;
  findTruckByName(name: string): Promise<ITruckDocument | null>;
  fetchAllTrucksByPlantId(plantId: string): Promise<ReturnFetchAllTrucksByPlantId>;
}
