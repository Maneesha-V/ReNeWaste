import { ITruckService } from "./interface/ITruckService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckRepository } from "../../repositories/truck/interface/ITruckRepository";

@injectable()
export class TruckService implements ITruckService {
  constructor(
    @inject(TYPES.TruckRepository)
    private truckRepository: ITruckRepository
  ) {}
  async getTruckForDriver(driverId: string) {
    const result = await this.truckRepository.getAvailableTrucks(driverId);
    return result;
  }
  async requestTruck(driverId: string) {
    return await this.truckRepository.reqTruckToWastePlant(driverId);
  }
}
