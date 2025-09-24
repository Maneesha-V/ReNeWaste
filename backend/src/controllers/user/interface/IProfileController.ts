import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IProfileController {
  getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getEditProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateUserProfileHandler(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
