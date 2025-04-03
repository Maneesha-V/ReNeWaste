import { IUserDocument } from "../../models/user/interfaces/userInterface";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: IUserDocument;
  token: string;
}

export interface SignupResponse {
  user: IUserDocument;
  token: string;
}
export interface GoogleLoginReq {
  email: string; 
  googleId: string; 
  token: string;
}
export interface GoogleLoginResp {
  user: IUserDocument;
  token: string;
}
export interface OtpRecord {
  email: string;
  otp: string;
  createdAt: Date; 
}