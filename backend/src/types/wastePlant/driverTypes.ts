import { IDriver } from "../../models/driver/interfaces/driverInterface";

export interface PaginatedDriversResult {
  drivers: IDriver[];
  total: number;
}
export type ReturnTaluk= {
  taluk: string;
}
export type ReturnGetEditDriver = {
  driver : IDriver;
  taluk : string;
}