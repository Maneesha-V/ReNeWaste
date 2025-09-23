import { DriverDTO } from "../../../dtos/driver/driverDTO";
import { TruckAvailbleDTO, TruckDTO } from "../../../dtos/truck/truckDTO";
import { MarkReturnProps } from "../../../types/driver/truckTypes";

export interface ITruckService {
  getTruckForDriver(driverId: string, wasteplantId: string): Promise<TruckAvailbleDTO[]>;
  requestTruck(driverId: string): Promise<DriverDTO>;
  markTruckReturnService(data: MarkReturnProps): Promise<boolean>;
}