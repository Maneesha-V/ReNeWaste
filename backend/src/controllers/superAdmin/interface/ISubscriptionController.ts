import { AuthRequest } from "../../../types/common/middTypes";
import {NextFunction, Response } from "express";

export interface ISubscriptionController {
    createSubscriptionPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    fetchSubscriptionPlans(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    deleteSubscriptionPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getSubscriptionPlanById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}