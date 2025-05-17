import { ITruck } from "../../../models/truck/interfaces/truckInterface";
import { PaginatedTrucksResult } from "../../../types/wastePlant/truckTypes";

export interface ITruckService {
    addTruck(data: ITruck): Promise<ITruck>;
    getAllTrucks(plantId: string, page: number, limit: number, search: string): Promise<PaginatedTrucksResult>
    getAvailableTrucksService(driverId: string): Promise<ITruck[]>;
    getTruckByIdService(truckId: string): Promise<ITruck | null>;
    updateTruckByIdService(truckId: string, data: any): Promise<ITruck | null>;
    deleteTruckByIdService(truckId: string): Promise<ITruck | null>;
    pendingTruckReqsts(plantId: string): Promise<any>;
}