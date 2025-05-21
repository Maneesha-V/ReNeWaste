import { inject, injectable } from "inversify";
import { OTPModel } from "../../models/user/otpModel";
import {
  IWastePlant,
  IWastePlantDocument,
} from "../../models/wastePlant/interfaces/wastePlantInterface";
import { WastePlantModel } from "../../models/wastePlant/wastePlantModel";
import { OtpRecord } from "../../types/user/authTypes";
import BaseRepository from "../baseRepository/baseRepository";
import { IWastePlantRepository } from "./interface/IWastePlantRepository";
import TYPES from "../../config/inversify/types";
import { IOtpRepository } from "../otp/interface/IOtpRepository";

@injectable()
export class WastePlantRepository extends BaseRepository<IWastePlantDocument> implements IWastePlantRepository {
  constructor(
    @inject(TYPES.OtpRepository)
    private otpRepository: IOtpRepository
  ){
    super(WastePlantModel)
  }
  async createWastePlant(data: IWastePlant): Promise<IWastePlantDocument> {
    try {
      const wastePlant = new this.model(data);
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
    return await this.model.findOne({ email });
  }
  async findWastePlantByLicense(
    licenseNumber: string
  ): Promise<IWastePlant | null> {
    return await this.model.findOne({ licenseNumber });
  }
  async findWastePlantByTaluk(taluk: string): Promise<IWastePlant | null> {
    return await this.model.findOne({ taluk });
  }
  async findWastePlantByName(plantName: string): Promise<IWastePlant | null> {
    return await this.model.findOne({ plantName });
  }

  async getAllWastePlants(): Promise<IWastePlant[]> {
    return await this.model.find();
  }
  async getWastePlantById(id: string) {
    return await this.model.findById(id);
  }
  async updateWastePlantById(
    id: string,
    data: any
  ): Promise<IWastePlant | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
  async saveOtp(email: string, otp: string): Promise<void> {
    // await OTPModel.create({ email, otp, createdAt: new Date() });
    await this.otpRepository.saveOtp( email, otp);
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await this.otpRepository.reSaveOtp(email, otp);
    // await OTPModel.findOneAndUpdate(
    //   { email },
    //   { otp, createdAt: new Date() },
    //   { new: true, upsert: true }
    // );
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await this.otpRepository.findOtpByEmail(email);
    // return await OTPModel.findOne({ email });
  }
  async deleteOtp(email: string): Promise<void> {
    await this.otpRepository.deleteOtp(email);
    // await OTPModel.deleteOne({ email });
  }
  async updateWastePlantPassword(
    email: string,
    hashedPassword: string
  ): Promise<void> {
    await this.model.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true, runValidators: false }
    );
  }
  async findByPincode(pincode: string): Promise<void> {
    await this.model.findOne({
      servicePincodes: pincode
    });
  }
  async deleteWastePlantById(id: string) {
    return await this.model.findByIdAndDelete(id);
  }
}

