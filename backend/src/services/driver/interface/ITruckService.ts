import { DriverDTO, MarkReturnProps } from "../../../dtos/driver/driverDTO";
import { TruckAvailbleDTO, TruckDTO } from "../../../dtos/truck/truckDTO";

export interface ITruckService {
  getTruckForDriver(
    driverId: string,
    wasteplantId: string,
  ): Promise<TruckAvailbleDTO[]>;
  requestTruck(driverId: string): Promise<DriverDTO>;
  markTruckReturnService(data: MarkReturnProps): Promise<boolean>;
}
