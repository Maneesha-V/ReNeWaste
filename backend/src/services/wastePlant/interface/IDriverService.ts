import { IDriver } from "../../../models/driver/interfaces/driverInterface";

export interface IDriverService {
    addDriver(data: IDriver): Promise<IDriver>;
    getAllDrivers(plantId: string): Promise<IDriver[]>;
    getDriverByIdService(driverId: string): Promise<IDriver | null>;
    updateDriverByIdService(driverId: string, data: any): Promise<IDriver | null>;
    deleteDriverByIdService(driverId: string): Promise<IDriver | null>;
}