import { DriverDTO } from "../../../dtos/driver/driverDTO";
import { TruckDTO } from "../../../dtos/truck/truckDTO";
import { MarkReturnProps } from "../../../types/driver/truckTypes";

export interface ITruckService {
  getTruckForDriver(driverId: string, wasteplantId: string): Promise<TruckDTO[]>;
  requestTruck(driverId: string): Promise<DriverDTO>;
  markTruckReturnService(data: MarkReturnProps): Promise<boolean>;
}