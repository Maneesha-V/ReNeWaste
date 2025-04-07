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
  async getAllDrivers(): Promise<IDriver[]> {
    return await DriverRepository.getAllDrivers();
  }
}
export default new DriverService();
