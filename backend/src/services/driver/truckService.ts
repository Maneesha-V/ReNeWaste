import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";
import { MarkReturnProps } from "../../types/driver/truckTypes";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import mongoose from "mongoose";
import { TruckMapper } from "../../mappers/TruckMapper";
import { DriverMapper } from "../../mappers/DriverMapper";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository,
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ) {}
  async getTruckForDriver(driverId: string, wasteplantId: string) {
    const result = await this.truckRepository.getAssignedAvailableTrucks(driverId, wasteplantId);
    if(!result){
      throw new Error("Can't found trucks.")
    }
    return TruckMapper.mapTrucksDTO(result);
  }
  async requestTruck(driverId: string) {
    const driver = await this.truckRepository.reqTruckToWastePlant(driverId);
    if(!driver){
      throw new Error("Driver not found.")
    }
    return DriverMapper.mapDriverDTO(driver)
  }
  async markTruckReturnService({ truckId, plantId, driverId }: MarkReturnProps) {
    const {driver, truck} =  await this.driverRepository.markTruckAsReturned(truckId, plantId, driverId);
    if(!driver || !truck){
      throw new Error("Driver or truck not found")
    }
    return true;
  }
}
