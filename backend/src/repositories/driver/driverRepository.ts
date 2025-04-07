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
}
export default new DriverRepository();
