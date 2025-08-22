import { AuthRequest } from "../../../types/common/middTypes";
import { NextFunction, Response } from "express";

export interface ISubscriptionController {
    fetchSubscriptionPlan(req: AuthRequest, res:Response, next: NextFunction) :Promise<void>;    
    fetchSubscriptionPlans(req: AuthRequest, res:Response, next: NextFunction) :Promise<void>;
}