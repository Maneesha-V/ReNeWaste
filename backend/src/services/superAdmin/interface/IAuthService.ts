import { SuperAdminLoginRequest, SuperAdminLoginResponse, SuperAdminSignupRequest, SuperAdminSignupResponse } from "../../../types/superAdmin/authTypes";

export interface ISuperAdminAuthService {
    verifyToken(token: string): Promise<{ token: string }>;
    adminLoginService(data: SuperAdminLoginRequest): Promise<SuperAdminLoginResponse>;
    adminSignupService(data: SuperAdminSignupRequest): Promise<SuperAdminSignupResponse>;
    sendOtpService(email: string): Promise<{ message: string; otp: string }>;
    resendOtpService(email: string): Promise<{ message: string; otp: string }>;
    verifyOtpService(email: string, otp: string): Promise<boolean>;
    resetPasswordService(email: string, newPassword: string): Promise<void>;
}