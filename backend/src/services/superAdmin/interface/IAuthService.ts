import {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
  SuperAdminSignupRequest,
} from "../../../dtos/superadmin/superadminDTO";

export interface ISuperAdminAuthService {
  verifyToken(token: string): Promise<{ token: string }>;
  adminLoginService(
    data: SuperAdminLoginRequest,
  ): Promise<SuperAdminLoginResponse>;
  adminSignupService(data: SuperAdminSignupRequest): Promise<boolean>;
  sendOtpService(email: string): Promise<boolean>;
  resendOtpService(email: string): Promise<boolean>;
  verifyOtpService(email: string, otp: string): Promise<boolean>;
  resetPasswordService(email: string, newPassword: string): Promise<boolean>;
}
