import { Types } from "mongoose";
import {
  ITruck,
  ITruckDocument,
} from "../../../models/truck/interfaces/truckInterface";
import { PaginatedTrucksResult } from "../../../types/wastePlant/truckTypes";

export interface ITruckRepository {
  findTruckByVehicle(vehicleNumber: string): Promise<ITruck | null>;
  createTruck(data: ITruck): Promise<ITruckDocument>;
  getAllTrucks(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedTrucksResult>;
  getAvailableTrucks(driverId: string, plantId: string): Promise<any>;
  getTruckById(truckId: string): Promise<ITruck | null>;
  updateTruckById(truckId: string, data: any): Promise<ITruck | null>;
  deleteTruckById(truckId: string): Promise<ITruck | null>;
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
}
