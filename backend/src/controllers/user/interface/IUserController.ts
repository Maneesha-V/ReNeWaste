import { Request, Response } from "express";

export interface IUserController {
  refreshToken(req: Request, res: Response): Promise<void>;
  signup(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  sendOtpForSignup(req: Request, res: Response): Promise<void>;
  resendOtpForSignup(req: Request, res: Response): Promise<void>;
  verifyOtpForSignup(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
  googleSignUp(req: Request, res: Response): Promise<void>;
  googleLogin(req: Request, res: Response): Promise<void>;
}

