import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IAuthController {
  refreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  driverLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  driverLogout(req: Request, res: Response, next: NextFunction): Promise<void>;
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
