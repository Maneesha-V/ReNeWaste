import bcrypt from "bcrypt";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import { IDriverService } from "./interface/IDriverService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { DriverMapper } from "../../mappers/DriverMapper";
import {
  DriverDTO,
  PaginatedDriversResult,
  ReturnGetEditDriver,
  ReturnTaluk,
} from "../../dtos/driver/driverDTO";

@injectable()
export class DriverService implements IDriverService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionplanRepository: ISubscriptionPlanRepository,
  ) {}
  async addDriver(data: IDriver): Promise<boolean> {
    const driversCount = await this.driverRepository.fetchAllDriversByPlantId(
      data.wasteplantId!.toString(),
    );
    const totalDriverCount =
      driversCount.active + driversCount.inactive + driversCount.suspended;
    const plant = await this.wastePlantRepository.getWastePlantById(
      data.wasteplantId!.toString(),
    );
    if (!plant) {
      throw new Error("Plant not found.");
    }
    if (plant.status === "Active") {
      const purchasedPlan =
        await this.subscriptionplanRepository.checkPlanNameExist(
          plant.subscriptionPlan!,
        );
      if (!purchasedPlan) {
        throw new Error("Subscription plan not found.");
      }
      if (totalDriverCount >= purchasedPlan?.driverLimit) {
        throw new Error(
          `You can't add new driver bcoz your plan driver limit is ${purchasedPlan?.driverLimit}.`,
        );
      }
    }

    const existingEmail = await this.driverRepository.findDriverByEmail(
      data.email,
    );
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    const existingName = await this.driverRepository.findDriverByName(
      data.name,
    );
    if (existingName) {
      throw new Error("Name already exists");
    }
    const existingLicenseNo = await this.driverRepository.findDriverByLicense(
      data.licenseNumber,
    );
    if (existingLicenseNo) {
      throw new Error("License number already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newData: IDriver = {
      ...data,
      password: hashedPassword,
    };
    const created = await this.driverRepository.createDriver(newData);
    if (!created) {
      throw new Error("Can't create driver.");
    }
    return true;
  }
  async getAllDrivers(
    plantId: string,
    page: number,
    limit: number,
    search: string,
  ): Promise<PaginatedDriversResult> {
    return await this.driverRepository.getAllDrivers(
      plantId,
      page,
      limit,
      search,
    );
  }
  async getDriverByIdService(
    driverId: string,
    plantId: string,
  ): Promise<ReturnGetEditDriver> {
    const driver = await this.driverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
    const { taluk } = await this.getTalukByPlantIdService(plantId);
    return {
      driver: DriverMapper.mapDriverDTO(driver),
      taluk,
    };
  }
  async updateDriverByIdService(
    driverId: string,
    data: IDriver,
  ): Promise<DriverDTO> {
    const driver = await this.driverRepository.updateDriverById(driverId, data);
    if (!driver) {
      throw new Error("Driver not found.");
    }
    return DriverMapper.mapDriverDTO(driver);
  }
  async deleteDriverByIdService(driverId: string) {
    const updated = await this.driverRepository.deleteDriverById(driverId);
    return DriverMapper.mapDriverDTO(updated);
  }
  async getTalukByPlantIdService(plantId: string): Promise<ReturnTaluk> {
    const res = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!res?.taluk) throw new Error("Taluk not found in plant record");
    return { taluk: res.taluk };
  }
}
