import { IDriver } from "../../../models/driver/interfaces/driverInterface";

export interface IDriverService {
    addDriver(data: IDriver): Promise<IDriver>;
    getAllDrivers(): Promise<IDriver[]>;
}