import { LoginRequest, LoginResponse } from "../../../types/wastePlant/authTypes";

export interface IAuthService {
    verifyToken(token: string): Promise<{ token: string }>;
    loginWastePlant(loginData: LoginRequest): Promise<LoginResponse>;
    sendOtpService(email: string): Promise<{ message: string; otp: string }>;
    resendOtpService(email: string): Promise<{ message: string; otp: string }>;
    verifyOtpService(email: string, otp: string): Promise<boolean>;
    resetPasswordService(email: string, newPassword: string): Promise<void>;
}