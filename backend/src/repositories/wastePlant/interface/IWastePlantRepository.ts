import { PaginationInput } from "../../../dtos/common/commonDTO";
import {
  IWastePlant,
  IWastePlantDocument,
} from "../../../models/wastePlant/interfaces/wastePlantInterface";
import { OtpRecord } from "../../../types/user/authTypes";
import { PaginatedWastePlantResult } from "../types/wasteplantTypes";

export interface IWastePlantRepository {
  createWastePlant(data: IWastePlant): Promise<IWastePlantDocument>;
  findWastePlantByEmail(email: string): Promise<IWastePlantDocument | null>;
  findWastePlantByLicense(licenseNumber: string): Promise<IWastePlant | null>;
  findWastePlantByTaluk(taluk: string): Promise<IWastePlant | null>;
  findWastePlantByName(plantName: string): Promise<IWastePlant | null>;
  getAllWastePlants(data: PaginationInput): Promise<PaginatedWastePlantResult | null>;
  getWastePlantById(id: string): Promise<IWastePlantDocument | null>;
  updateWastePlantById(id: string,data: IWastePlant): Promise<IWastePlant | null>;
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<OtpRecord | null>;
  deleteOtp(email: string): Promise<void>;
  updateWastePlantPassword( email: string, hashedPassword: string): Promise<void>;
  findByPincode(pincode: string): Promise<void>;
  deleteWastePlantById(id: string): Promise<IWastePlantDocument | null>;
  getAllActiveWastePlants(): Promise<IWastePlantDocument[] | null>;
  updatePlantStatus(plantId: string, status: string): Promise<void>;
  getTotalWastePlants(): Promise<number>;
}
