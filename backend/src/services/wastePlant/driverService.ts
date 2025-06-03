import bcrypt from "bcrypt";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import { IDriverService } from "./interface/IDriverService";
import { PaginatedDriversResult, ReturnGetEditDriver, ReturnTaluk } from "../../types/wastePlant/driverTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";

@injectable()
export class DriverService implements IDriverService {
  constructor(
    @inject(TYPES.DriverRepository)
    private driverRepository: IDriverRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository
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
  async getDriverByIdService(driverId: string, plantId: string): Promise<ReturnGetEditDriver> {
    try {
      const driver = await this.driverRepository.getDriverById(driverId);
      if (!driver) throw new Error("Driver not found");
      const { taluk } = await this.getTalukByPlantIdService(plantId);
      return { driver, taluk }
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
  async getTalukByPlantIdService(plantId: string): Promise<ReturnTaluk> {
    const res =  await this.wastePlantRepository.getWastePlantById(plantId) 
    if (!res?.taluk) throw new Error("Taluk not found in plant record");
    return { taluk: res.taluk };
  }
}
