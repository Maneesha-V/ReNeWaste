import { Request, Response } from "express";

export interface IAuthController {
  wastePlantLogin(req: Request, res: Response): Promise<void>;
  wastePlantLogout(req: Request, res: Response): Promise<void>;
  sendOtp(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}