import { IDriver, IDriverDocument } from "../../../models/driver/interfaces/driverInterface";

export interface IDriverRepository {
createDriver(data: IDriver): Promise<IDriverDocument>;
findDriverByEmail(email: string): Promise<IDriverDocument | null>;
findDriverByLicense(licenseNumber: string): Promise<IDriver | null>;
getAllDrivers(): Promise<IDriver[]>;
}