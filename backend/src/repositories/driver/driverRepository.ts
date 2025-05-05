import { Types } from "mongoose";
import { DriverModel } from "../../models/driver/driverModel";
import {
  IDriver,
  IDriverDocument,
} from "../../models/driver/interfaces/driverInterface";
import { IDriverRepository } from "./interface/IDriverRepository";
import { TruckModel } from "../../models/truck/truckModel";

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
  async findDriverByName(name: string): Promise<IDriverDocument | null> {
    return await DriverModel.findOne({ name });
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
    async deleteDriverById(driverId: string) {
        return await DriverModel.findByIdAndDelete(driverId);
      }
      async fetchDrivers(wastePlantId: string) {
        const objectId = new Types.ObjectId(wastePlantId);
        return await DriverModel.find({wasteplantId: objectId, status: "Active"}).sort({ name: 1 });
      };
      async updateDriverTruck(
        driverId: string,
        // assignedZone: string,
        assignedTruckId: string
      ){
        const objectIdDriver = new Types.ObjectId(driverId);
        const objectIdTruck= new Types.ObjectId( assignedTruckId);
        await TruckModel.findByIdAndUpdate(
          objectIdTruck,
          {
            $set: {
              assignedDriver: objectIdDriver
            }
          }
        )
        return await DriverModel.findByIdAndUpdate(
          objectIdDriver,
          {
            $set: {
              // assignedZone: assignedZone,
              assignedTruckId: objectIdTruck
            },
          },
          { new: true }
        );
      }
      async updateDriverAssignedZone(
        driverId: string,
        assignedZone: string,
      ) {
        const objectId = new Types.ObjectId(driverId);
        return await DriverModel.findByIdAndUpdate(
          objectId,
          {
            $set: {
              assignedZone: assignedZone,
            },
          },
          { new: true }
        );
      }
      
      async getDriversByLocation(location: string, plantId: string) {
        const objectId = new Types.ObjectId(plantId);
        return await DriverModel.find({wasteplantId: objectId, assignedZone: location}).sort({ name: 1 });
      };
}
export default new DriverRepository();
