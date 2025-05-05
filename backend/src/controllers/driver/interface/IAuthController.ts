import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IAuthController {
  refreshToken(req: AuthRequest, res: Response): Promise<void>;
  driverLogin(req: Request, res: Response): Promise<void>;
  driverLogout(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}