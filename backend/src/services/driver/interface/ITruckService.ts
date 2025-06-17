import { ITruck } from "../../../models/truck/interfaces/truckInterface";
import { MarkReturnProps } from "../../../types/driver/truckTypes";

export interface ITruckService {
  getTruckForDriver(driverId: string, wasteplantId: string): Promise<ITruck[] | null>;
  requestTruck(driverId: string): Promise<ITruck>;
  markTruckReturnService(data: MarkReturnProps): Promise<any>;
}