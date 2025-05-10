import { ITruck } from "../../../models/truck/interfaces/truckInterface";

export interface ITruckService {
    addTruck(data: ITruck): Promise<ITruck>;
    getAllTrucks(plantId: string): Promise<ITruck[]>;
    getAvailableTrucksService(driverId: string): Promise<ITruck[]>;
    getTruckByIdService(truckId: string): Promise<ITruck | null>;
    updateTruckByIdService(truckId: string, data: any): Promise<ITruck | null>;
    deleteTruckByIdService(truckId: string): Promise<ITruck | null>;
    pendingTruckReqsts(plantId: string): Promise<any>;
}