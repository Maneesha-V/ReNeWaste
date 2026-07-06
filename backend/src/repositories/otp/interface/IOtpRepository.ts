import { IOtp } from "../../../models/user/interfaces/otpInterface";

export interface IOtpRepository {
  saveOtp(email: string, otp: string): Promise<void>;
  reSaveOtp(email: string, otp: string): Promise<void>;
  findOtpByEmail(email: string): Promise<IOtp | null>;
  deleteOtp(email: string): Promise<void>;
}
