import bcrypt from "bcrypt";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import { IDriverService } from "./interface/IDriverService";
import { PaginatedDriversResult } from "../../types/wastePlant/driverTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";

@injectable()
export class DriverService implements IDriverService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository
  ) {}
  async addDriver(data: IDriver): Promise<IDriver> {
    const existingEmail = await this.driverRepository.findDriverByEmail(
      data.email
    );
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    const existingName = await this.driverRepository.findDriverByName(
      data.name
    );
    if (existingName) {
      throw new Error("Name already exists");
    }
    const existingLicenseNo = await this.driverRepository.findDriverByLicense(
      data.licenseNumber
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
    return await this.driverRepository.createDriver(newData);
  }
  async getAllDrivers(
    plantId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<PaginatedDriversResult> {
    return await this.driverRepository.getAllDrivers(
      plantId,
      page,
      limit,
      search
    );
  }
  async getDriverByIdService(driverId: string): Promise<IDriver | null> {
    try {
      return await this.driverRepository.getDriverById(driverId);
    } catch (error) {
      throw new Error("Error fetching driver from service");
    }
  }
  async updateDriverByIdService(
    driverId: string,
    data: any
  ): Promise<IDriver | null> {
    try {
      return await this.driverRepository.updateDriverById(driverId, data);
    } catch (error) {
      throw new Error("Error updating driver in service");
    }
  }
  async deleteDriverByIdService(driverId: string) {
    return await this.driverRepository.deleteDriverById(driverId);
  }
}
