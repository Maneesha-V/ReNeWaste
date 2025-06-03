import { IDriver } from "../../../models/driver/interfaces/driverInterface";
import { PaginatedDriversResult, ReturnGetEditDriver, ReturnTaluk } from "../../../types/wastePlant/driverTypes";

export interface IDriverService {
    addDriver(data: IDriver): Promise<IDriver>;
    getAllDrivers(plantId: string, page: number, limit: number, search: string): Promise<PaginatedDriversResult>;
    getDriverByIdService(driverId: string, plantId: string): Promise<ReturnGetEditDriver>;
    updateDriverByIdService(driverId: string, data: any): Promise<IDriver | null>;
    deleteDriverByIdService(driverId: string): Promise<IDriver | null>;
    getTalukByPlantIdService(plantId: string): Promise<ReturnTaluk>;
}