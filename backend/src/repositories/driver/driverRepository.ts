import { DriverModel } from "../../models/driver/driverModel";
import {
  IDriver,
  IDriverDocument,
} from "../../models/driver/interfaces/driverInterface";
import { IDriverRepository } from "./interface/IDriverRepository";

class DriverRepository implements IDriverRepository {
  async createDriver(data: IDriver): Promise<IDriverDocument> {
    try {
      const driver = new DriverModel(data);
      console.log("driver", driver);
      return await driver.save();
    } catch (error: any) {
      console.error("MongoDB Insert Error:", error);
      throw error;
    }
  }
  async findDriverByEmail(email: string): Promise<IDriverDocument | null> {
    return await DriverModel.findOne({ email });
  }
  async findDriverByLicense(licenseNumber: string): Promise<IDriver | null> {
    return await DriverModel.findOne({ licenseNumber });
  }
  async getAllDrivers(): Promise<IDriver[]> {
    return await DriverModel.find();
  }
  async updateDriverPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await DriverModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
    async getDriverById(driverId: string) {
      return await DriverModel.findById(driverId);
    }
   async updateDriverById(
      driverId: string,
      data: any
    ): Promise<IDriver | null> {
      return await DriverModel.findByIdAndUpdate(driverId, data, { new: true });
    }
}
export default new DriverRepository();
