import { IDriver } from "../../models/driver/interfaces/driverInterface";

export interface PaginatedDriversResult {
  drivers: IDriver[];
  total: number;
}