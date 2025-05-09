import { IUser, IUserDocument } from "../../../models/user/interfaces/userInterface";
import { SignupResponse, LoginRequest, LoginResponse, GoogleLoginReq, GoogleLoginResp } from "../../../types/user/authTypes";

export interface IAuthService {
  verifyToken(token: string): Promise<{ token: string }>;
  signupUser(userData: IUser): Promise<SignupResponse>;
  loginUser(loginData: LoginRequest): Promise<LoginResponse>;
  sendOtpSignupService(email: string): Promise<{ message: string; otp: string }>;
  resendOtpSignupService(email: string): Promise<{ message: string; otp: string }>;
  verifyOtpSignupService(email: string, otp: string): Promise<boolean>;
  sendOtpService(email: string): Promise<{ message: string; otp: string }>;
  resendOtpService(email: string): Promise<{ message: string; otp: string }>;
  verifyOtpService(email: string, otp: string): Promise<boolean>;
  resetPasswordService(email: string, newPassword: string): Promise<void>;
  googleSignUpService(email: string, displayName: string, uid: string): Promise<{ user: IUserDocument; token: string }>;
  googleLoginService(googleLoginData: GoogleLoginReq): Promise<GoogleLoginResp>;
}
