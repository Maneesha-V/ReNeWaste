import { DriverDTO, PaginatedDriversResult, ReturnGetEditDriver, ReturnTaluk } from "../../../dtos/driver/driverDTO";
import { IDriver } from "../../../models/driver/interfaces/driverInterface";


export interface IDriverService {
    addDriver(data: IDriver): Promise<boolean>;
    getAllDrivers(plantId: string, page: number, limit: number, search: string): Promise<PaginatedDriversResult>;
    getDriverByIdService(driverId: string, plantId: string): Promise<ReturnGetEditDriver>;
    updateDriverByIdService(driverId: string, data: IDriver): Promise<DriverDTO>;
    deleteDriverByIdService(driverId: string): Promise<DriverDTO>;
    getTalukByPlantIdService(plantId: string): Promise<ReturnTaluk>;
}