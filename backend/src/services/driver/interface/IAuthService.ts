import { LoginRequest, LoginResponse } from "../../../dtos/driver/driverDTO";


export interface IAuthService {
    verifyToken(token: string): Promise<{ token: string }>;
    loginDriver(loginData: LoginRequest): Promise<LoginResponse>;
    sendOtpService(email: string): Promise<string>;
    resendOtpService(email: string): Promise<string>;
    verifyOtpService(email: string, otp: string): Promise<boolean>;
    resetPasswordService(email: string, newPassword: string): Promise<void>;
}