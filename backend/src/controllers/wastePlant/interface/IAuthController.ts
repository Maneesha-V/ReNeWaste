import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IAuthController {
  refreshToken(req: Request, res: Response): Promise<void>;
  wastePlantLogin(req: AuthRequest, res: Response, next: NextFunction): Promise<void>
  wastePlantLogout(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}