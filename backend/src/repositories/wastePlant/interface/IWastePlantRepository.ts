import {
  IWastePlant,
  IWastePlantDocument,
} from "../../../models/wastePlant/interfaces/wastePlantInterface";
import { OtpRecord } from "../../../types/user/authTypes";

export interface IWastePlantRepository {
  createWastePlant(data: IWastePlant): Promise<IWastePlantDocument>;
  findWastePlantByEmail(email: string): Promise<IWastePlant | null>;
  findWastePlantByLicense(licenseNumber: string): Promise<IWastePlant | null>;
  findWastePlantByTaluk(taluk: string): Promise<IWastePlant | null>;
  findWastePlantByName(plantName: string): Promise<IWastePlant | null>;
  getAllWastePlants(): Promise<IWastePlant[]>;
  getWastePlantById(id: string): Promise<IWastePlant | null>;
  updateWastePlantById(id: string,data: any): Promise<IWastePlant | null>;
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<OtpRecord | null>;
  deleteOtp(email: string): Promise<void>;
  updateWastePlantPassword( email: string, hashedPassword: string): Promise<void>;
  findByPincode(pincode: string): Promise<void>;
  deleteWastePlantById(id: string): Promise<IWastePlantDocument | null>;
}
