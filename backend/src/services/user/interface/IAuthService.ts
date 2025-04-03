import { IUser, IUserDocument } from "../../../models/user/interfaces/userInterface";
import { SignupResponse, LoginRequest, LoginResponse, GoogleLoginReq, GoogleLoginResp } from "../../../types/user/authTypes";

export interface IAuthService {
  signupUser(userData: IUser): Promise<SignupResponse>;
  loginUser(loginData: LoginRequest): Promise<LoginResponse>;
  sendOtpService(email: string): Promise<{ message: string; otp: string }>;
  resendOtpService(email: string): Promise<{ message: string; otp: string }>;
  verifyOtpService(email: string, otp: string): Promise<boolean>;
  resetPasswordService(email: string, newPassword: string): Promise<void>;
  googleSignUpService(email: string, displayName: string, uid: string): Promise<{ user: IUserDocument; token: string }>;
  googleLoginService(googleLoginData: GoogleLoginReq): Promise<GoogleLoginResp>;
}
