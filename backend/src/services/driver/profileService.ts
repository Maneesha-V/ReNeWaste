import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ){}
  async getDriverProfile(driverId: string) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
    return driver;
  }
  async updateDriverProfile(driverId: string, updatedData: any) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");

    return await this.driverRepository.updateDriverById(driverId, updatedData);
  }
  async fetchDriversService(wastePlantId: string) {
    return await this.driverRepository.fetchDrivers(wastePlantId);
  }
}
