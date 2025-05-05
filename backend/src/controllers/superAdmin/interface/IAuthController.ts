import { Request, Response } from "express";

export interface IAuthController {
  refreshToken(req: Request, res: Response): Promise<void>
  superAdminLogin(req: Request, res: Response): Promise<void>;
  superAdminSignup(req: Request, res: Response): Promise<void>;
  superAdminLogout(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}
