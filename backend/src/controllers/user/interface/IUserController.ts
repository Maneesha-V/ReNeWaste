import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IUserController {
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  sendOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  resendOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  verifyOtpForSignup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleSignUp(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
}
