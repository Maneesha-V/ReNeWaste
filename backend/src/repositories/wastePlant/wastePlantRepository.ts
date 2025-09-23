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
import { PaginationInput } from "../../dtos/common/commonDTO";
import { Number } from "mongoose";

@injectable()
export class WastePlantRepository
  extends BaseRepository<IWastePlantDocument>
  implements IWastePlantRepository
{
  constructor(
    @inject(TYPES.OtpRepository)
    private otpRepository: IOtpRepository
  ) {
    super(WastePlantModel);
  }
  async createWastePlant(data: IWastePlant): Promise<IWastePlantDocument> {
      const wastePlant = new this.model(data);
      console.log("wastePlantData", wastePlant);
      return await wastePlant.save();
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
  async findWastePlantByTaluk(taluk: string): Promise<string  | null> {
    const plant = await this.model.findOne({ taluk }, {_id: 1});
    return plant ? plant._id.toString() : null;
  }
  async findWastePlantByName(plantName: string): Promise<IWastePlant | null> {
    return await this.model.findOne({ plantName });
  }

  async getAllWastePlants(data: PaginationInput) {
    const { page, limit, search, minCapacity, maxCapacity } = data;
    const searchRegex = new RegExp(search, "i");
    const query: any = {
      isDeleted: false,
      $or: [
        { plantName: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { subscriptionPlan: { $regex: searchRegex } },
        { contactNo: { $regex: searchRegex } },
        { status: { $regex: searchRegex } },
      ],
    };
    if (!isNaN(Number(search))) {
      query.$or.push({ capacity: Number(search) });
    }

    if (minCapacity !== undefined && maxCapacity !== undefined) {
      query.capacity = { $gte: minCapacity, $lte: maxCapacity };
    }
    const skip = (page - 1) * limit;

    const wasteplants = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.model.countDocuments(query);
    return { wasteplants, total };
  }
  async getWastePlantById(id: string) {
    return await this.model.findById(id);
  }
  async updateWastePlantById(
    id: string,
    data: Partial<IWastePlant>
  ): Promise<IWastePlantDocument | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }
  async saveOtp(email: string, otp: string): Promise<void> {
    await this.otpRepository.saveOtp(email, otp);
  }
  async reSaveOtp(email: string, otp: string): Promise<void> {
    await this.otpRepository.reSaveOtp(email, otp);
  }
  async findOtpByEmail(email: string): Promise<OtpRecord | null> {
    return await this.otpRepository.findOtpByEmail(email);
  }
  async deleteOtp(email: string): Promise<void> {
    await this.otpRepository.deleteOtp(email);
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
      servicePincodes: pincode,
    });
  }
  async deleteWastePlantById(id: string) {
    const updatedPlant = await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true, status: "Inactive" },
      { new: true }
    );
    if (!updatedPlant) {
      throw new Error("Plant not found");
    }
    return updatedPlant;
  }
  async getAllActiveWastePlants() {
    return await this.model.find({ status: "Active" });
  }
  async updatePlantStatus(plantId: string, status: string): Promise<void> {
    await this.model.findByIdAndUpdate(plantId, { status });
  }
  async getTotalWastePlants(): Promise<number> {
    return await this.model.countDocuments();
  }
}
