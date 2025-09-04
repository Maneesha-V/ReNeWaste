import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { BaseDTO } from "../base/BaseDTO";
export interface TruckDTO extends BaseDTO {
    name: string;
    vehicleNumber: string;
    capacity: number;
    assignedDriver?: string;
    wasteplantId?: string;
    status?: string;
    isReturned?: boolean;
    tareWeight: number;
    isDeleted?: boolean;
}
export type PaginatedResult = {
  trucks: TruckDTO[];
  total: number;
}
export type PaginatedTrucksResult = {
  trucks: ITruckDocument[];
  total: number;
}
export type ReturnFetchAllTrucksByPlantId = {
    active: number;
    inactive: number;
    maintenance: number;
}