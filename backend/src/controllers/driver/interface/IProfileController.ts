import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IProfileController {
  getProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDriversByWastePlant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
