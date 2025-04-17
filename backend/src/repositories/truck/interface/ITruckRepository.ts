import { ITruck, ITruckDocument } from "../../../models/truck/interfaces/truckInterface";

export interface ITruckRepository {
  findTruckByVehicle(vehicleNumber: string): Promise<ITruck | null>;
  createTruck(data: ITruck): Promise<ITruckDocument>;
  getAllTrucks(): Promise<ITruck[]>;
  getTruckById(truckId: string): Promise<ITruck | null>;
  updateTruckById(truckId: string, data: any): Promise<ITruck | null>;
  deleteTruckById(truckId: string): Promise<ITruck | null>;
}
