import { IProfileService } from "./interface/IProfileService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { DriverMapper } from "../../mappers/DriverMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { DriverDTO } from "../../dtos/driver/driverDTO";
import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";

@injectable()
export class ProfileService implements IProfileService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
  ) {}
  async getDriverProfile(driverId: string) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.NOT_FOUND,
      );
    }
    return DriverMapper.mapDriverDTO(driver);
  }
  async updateDriverProfile(driverId: string, updatedData: Partial<IDriverDocument>) {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.NOT_FOUND,
      );
    }

    const updated = await this.driverRepository.updateDriverById(
      driverId,
      updatedData,
    );
    if (!updated) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.UPDATE_FAILED,
      );
    }
    return DriverMapper.mapDriverDTO(updated);
  }
  async fetchDriversService(wastePlantId: string) {
    const drivers =
      await this.driverRepository.fetchDriversByPlantId(wastePlantId);
    if (!drivers) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.DRIVER.ERROR.DRIVERS_NOT_FOUND,
      );
    }
    return DriverMapper.mapDriversDTO(drivers);
  }
}
