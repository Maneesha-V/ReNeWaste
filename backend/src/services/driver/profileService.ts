import { IProfileService } from "./interface/IProfileService";
import DriverRepository from "../../repositories/driver/driverRepository";

class ProfileService implements IProfileService {
  async getDriverProfile(driverId: string) {
    const driver = await DriverRepository.getDriverById(driverId);
    if (!driver) throw new Error("Driver not found");
    return driver;
  }
  async updateDriverProfile(driverId: string, updatedData: any) {
    const driver = await DriverRepository.getDriverById(driverId);
    if (!driver) throw new Error("User not found");

    return await DriverRepository.updateDriverById(driverId, updatedData);
  }
}
export default new ProfileService();