import { OtpRecord } from "../../../dtos/user/otpDTO";
import { PaginatedWPlantResult } from "../../../dtos/wasteplant/WasteplantDTO";
import {
  IWastePlant,
  IWastePlantDocument,
  PaginationInputReq,
} from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IWastePlantRepository {
  createWastePlant(data: IWastePlant): Promise<IWastePlantDocument>;
  getWastePlantByPublicId(publicId: string): Promise<IWastePlantDocument | null>;
  findWastePlantByEmail(email: string): Promise<IWastePlantDocument | null>;
  findWastePlantByLicense(licenseNumber: string): Promise<IWastePlant | null>;
  findWastePlantByTaluk(taluk: string): Promise<string | null>;
  findWastePlantByName(plantName: string): Promise<IWastePlant | null>;
  getAllWastePlants(
    data: PaginationInputReq,
  ): Promise<PaginatedWPlantResult | null>;
  getWastePlantById(id: string): Promise<IWastePlantDocument | null>;
  updateWastePlantById(
    id: string,
    data: Partial<IWastePlant>,
  ): Promise<IWastePlantDocument | null>;
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<OtpRecord | null>;
  deleteOtp(email: string): Promise<void>;
  updateWastePlantPassword(
    email: string,
    hashedPassword: string,
  ): Promise<void>;
  findByPincode(pincode: string): Promise<void>;
  deleteWastePlantById(id: string): Promise<IWastePlantDocument | null>;
  getAllActiveWastePlants(): Promise<IWastePlantDocument[] | null>;
  updatePlantStatus(plantId: string, status: string): Promise<void>;
  getTotalWastePlants(): Promise<number>;
}
