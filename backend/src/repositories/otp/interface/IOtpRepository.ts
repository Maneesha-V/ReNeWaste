import { OtpRecord } from "../../../types/user/authTypes";

export interface IOtpRepository {
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<OtpRecord | null>;
  deleteOtp(email: string): Promise<void>;
}
