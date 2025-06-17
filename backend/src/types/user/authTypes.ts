import { Request } from "express";
import { IUserDocument } from "../../models/user/interfaces/userInterface";

export type LoginRequest = {
  email: string;
  password: string;
}

export type LoginResponse = {
  user: IUserDocument;
  token: string;
}

export type SignupResponse = {
  user: IUserDocument;
  token: string;
}
export type GoogleLoginReq = {
  email: string; 
  googleId: string; 
}
export type GoogleLoginResp = {
  user: IUserDocument;
  token: string;
}
export type OtpRecord = {
  email: string;
  otp: string;
  createdAt: Date; 
}

