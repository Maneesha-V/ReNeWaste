import { LoginRequest } from "../../../dtos/user/userDTO";
import { LoginWPResponse } from "../../../dtos/wasteplant/WasteplantDTO";

export interface IAuthService {
  verifyToken(token: string): Promise<{ token: string }>;
  loginWastePlant(loginData: LoginRequest): Promise<LoginWPResponse>;
  sendOtpService(email: string): Promise<string>;
  resendOtpService(email: string): Promise<string>;
  verifyOtpService(email: string, otp: string): Promise<boolean>;
  resetPasswordService(email: string, newPassword: string): Promise<void>;
}
