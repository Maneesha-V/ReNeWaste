import { ITruck } from "../../../models/truck/interfaces/truckInterface";

export interface ITruckService {
  getTruckForDriver(driverId: string): Promise<ITruck[]>;
  requestTruck(driverId: string): Promise<ITruck>;
}