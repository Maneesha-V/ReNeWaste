import bcrypt from "bcrypt";
import { IDriver } from "../../models/driver/interfaces/driverInterface";
import DriverRepository from "../../repositories/driver/driverRepository";
import { IDriverService } from "./interface/IDriverService";

class DriverService implements IDriverService {
  async addDriver(data: IDriver): Promise<IDriver> {
    const existingEmail = await DriverRepository.findDriverByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    const existingName = await DriverRepository.findDriverByName(data.name);
    if (existingName) {
      throw new Error("Name already exists");
    }
    const existingLicenseNo = await DriverRepository.findDriverByLicense(
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
    return await DriverRepository.createDriver(newData);
  }
  async getAllDrivers(plantId: string): Promise<IDriver[]> {
    return await DriverRepository.getAllDrivers(plantId);
  }
  async getDriverByIdService(driverId: string): Promise<IDriver | null> {
    try {
      return await DriverRepository.getDriverById(driverId);
    } catch (error) {
      throw new Error("Error fetching driver from service");
    }
  }
  async updateDriverByIdService(
    driverId: string,
    data: any
  ): Promise<IDriver | null> {
    try {
      return await DriverRepository.updateDriverById(driverId, data);
    } catch (error) {
      throw new Error("Error updating driver in service");
    }
  }
    async deleteDriverByIdService(driverId: string) {
      return await  DriverRepository.deleteDriverById(driverId)
    }
}
export default new DriverService();
