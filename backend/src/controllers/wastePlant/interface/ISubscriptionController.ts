import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface ISubscriptionController {
  fetchSubscriptionPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  fetchSubscriptionPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
