import {NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface ISubscriptionController {
    createSubscriptionPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    fetchSubscriptionPlans(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteSubscriptionPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getSubscriptionPlanById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}