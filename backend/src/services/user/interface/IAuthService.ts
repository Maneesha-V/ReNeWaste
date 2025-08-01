import { GoogleLoginReq, GoogleLoginResp, GoogleSignUpReq, GoogleSignUpResp, LoginRequest, LoginResponse } from "../../../dtos/user/userDTO";
import { IUser, IUserDocument } from "../../../models/user/interfaces/userInterface";
import { SignupResponse } from "../../../types/user/authTypes";

export interface IAuthService {
  verifyToken(token: string): Promise<{ token: string }>;
  signupUser(userData: IUser): Promise<SignupResponse>;
  loginUser(loginData: LoginRequest): Promise<LoginResponse>;
  sendOtpSignupService(email: string): Promise<{ message: string; otp: string }>;
  resendOtpSignupService(email: string): Promise<{ message: string; otp: string }>;
  verifyOtpSignupService(email: string, otp: string): Promise<boolean>;
  sendOtpService(email: string): Promise<void>;
  resendOtpService(email: string): Promise<boolean>;
  verifyOtpService(email: string, otp: string): Promise<boolean>;
  resetPasswordService(email: string, newPassword: string): Promise<void>;
  googleSignUpService(  {email,displayName,uid} : GoogleSignUpReq): Promise<GoogleSignUpResp>;
  googleLoginService(googleLoginData: GoogleLoginReq): Promise<GoogleLoginResp>;
}
