import { DriverDTO } from "../../../dtos/driver/driverDTO";
import { IDriverDocument } from "../../../models/driver/interfaces/driverInterface";

export interface IProfileService {
  getDriverProfile(userId: string): Promise<DriverDTO>;
  updateDriverProfile(driverId: string, updatedData: any): Promise<DriverDTO>;
  fetchDriversService(wastePlantId: string): Promise<DriverDTO[]>;
}
