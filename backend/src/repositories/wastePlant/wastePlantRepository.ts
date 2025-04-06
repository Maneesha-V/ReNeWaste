import { OTPModel } from "../../models/user/otpModel";
import {
  IWastePlant,
  IWastePlantDocument,
} from "../../models/wastePlant/interfaces/wastePlantInterface";
import { WastePlantModel } from "../../models/wastePlant/wastePlantModel";
import { OtpRecord } from "../../types/user/authTypes";
import { IWastePlantRepository } from "./interface/IWastePlantRepository";

export class WastePlantRepository implements IWastePlantRepository {
  async createWastePlant(data: IWastePlant): Promise<IWastePlantDocument> {
    try {
      const wastePlant = new WastePlantModel(data);
      console.log("wastePlantData", wastePlant);
      return await wastePlant.save();
    } catch (error: any) {
      console.error("MongoDB Insert Error:", error);
      throw error;
    }
  }

  async findWastePlantByEmail(
    email: string
  ): Promise<IWastePlantDocument | null> {
    return await WastePlantModel.findOne({ email });
  }
  async findWastePlantByLicense(
    licenseNumber: string
  ): Promise<IWastePlant | null> {
    return await WastePlantModel.findOne({ licenseNumber });
  }

  async findWastePlantByName(plantName: string): Promise<IWastePlant | null> {
    return await WastePlantModel.findOne({ plantName });
  }

  async getAllWastePlants(): Promise<IWastePlant[]> {
    return await WastePlantModel.find();
  }
  async getWastePlantById(id: string) {
    return await WastePlantModel.findById(id);
  }
  async updateWastePlantById(
    id: string,
    data: any
  ): Promise<IWastePlant | null> {
    return await WastePlantModel.findByIdAndUpdate(id, data, { new: true });
  }
  async saveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.create({ email, otp, createdAt: new Date() });
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { new: true, upsert: true }
    );
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await OTPModel.findOne({ email });
  }
  async deleteOtp(email: string): Promise<void> {
    await OTPModel.deleteOne({ email });
  }
  async updateWastePlantPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await WastePlantModel.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
}
export default new WastePlantRepository();
