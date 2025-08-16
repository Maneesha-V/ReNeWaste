import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IPickupController {
  getPickupPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  cancelPickupPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  cancelPickupReason(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
