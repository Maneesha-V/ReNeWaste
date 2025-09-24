import { NextFunction, Request, Response } from "express";

export interface IAuthController {
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  superAdminLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  superAdminSignup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  superAdminLogout(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}
