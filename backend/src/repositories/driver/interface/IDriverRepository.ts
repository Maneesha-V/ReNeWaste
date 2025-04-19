import { IDriver, IDriverDocument } from "../../../models/driver/interfaces/driverInterface";

export interface IDriverRepository {
createDriver(data: IDriver): Promise<IDriverDocument>;
findDriverByEmail(email: string): Promise<IDriverDocument | null>;
findDriverByLicense(licenseNumber: string): Promise<IDriver | null>;
getAllDrivers(): Promise<IDriver[]>;
updateDriverPassword(email: string, hashedPassword: string): Promise<void>;
getDriverById(driverId: string): Promise<IDriver | null>;
updateDriverById(driverId: string, data: any): Promise<IDriver | null>;
deleteDriverById(driverId: string): Promise<IDriver | null>;
fetchDrivers(wastePlantId: string): Promise<IDriverDocument[]>;
updateDriverAssignedZone(driverId: string,assignedZone: string): Promise<IDriverDocument | null>;
}