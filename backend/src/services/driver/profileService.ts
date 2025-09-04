import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { DriverMapper } from "../../mappers/DriverMapper";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ){}
  async getDriverProfile(driverId: string) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
    return DriverMapper.mapDriverDTO(driver);
  }
  async updateDriverProfile(driverId: string, updatedData: any) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");

    const updated = await this.driverRepository.updateDriverById(driverId, updatedData);
    if(!updated){
      throw new Error("Can't update")
    }
    return DriverMapper.mapDriverDTO(updated);
  }
  async fetchDriversService(wastePlantId: string) {
    const drivers = await this.driverRepository.fetchDriversByPlantId(wastePlantId);
     if (!drivers) throw new Error("Driver not found");
     return DriverMapper.mapDriversDTO(drivers);
  }
}
