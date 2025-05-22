import { IDriver, IDriverDocument } from "../../../models/driver/interfaces/driverInterface";
import { PaginatedDriversResult } from "../../../types/wastePlant/driverTypes";

export interface IDriverRepository {
createDriver(data: IDriver): Promise<IDriverDocument>;
findDriverByEmail(email: string): Promise<IDriverDocument | null>;
findDriverByName(name: string): Promise<IDriverDocument | null>;
findDriverByLicense(licenseNumber: string): Promise<IDriver | null>;
getAllDrivers(plantId: string, page: number,limit: number,search: string): Promise<PaginatedDriversResult>;
updateDriverPassword(email: string, hashedPassword: string): Promise<void>;
getDriverById(driverId: string): Promise<IDriver | null>;
updateDriverById(driverId: string, data: any): Promise<IDriver | null>;
deleteDriverById(driverId: string): Promise<IDriver | null>;
fetchDrivers(wastePlantId: string): Promise<IDriverDocument[]>;
updateDriverTruck(driverId: string,assignedTruckId: string): Promise<IDriverDocument | null>;
updateDriverAssignedZone(driverId: string,assignedZone: string): Promise<IDriverDocument | null>;
getDriversByLocation(location: string, plantId: string): Promise<IDriverDocument[]>;
updateDriverByPlantAndId(
  driverId: string,
  plantId: string,
  updateData: Partial<IDriver>
): Promise<IDriver | null>;

}