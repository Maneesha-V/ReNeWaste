import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { MarkReturnProps } from "../../types/driver/truckTypes";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import mongoose from "mongoose";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ) {}
  async getTruckForDriver(driverId: string, wasteplantId: string) {
    const result = await this.truckRepository.getAvailableTrucks(driverId, wasteplantId);
    return result;
  }
  async requestTruck(driverId: string) {
    return await this.truckRepository.reqTruckToWastePlant(driverId);
  }
  async markTruckReturnService({ truckId, plantId, driverId }: MarkReturnProps) {
    return  await this.driverRepository.markTruckAsReturned(truckId, plantId, driverId);
  }
}
