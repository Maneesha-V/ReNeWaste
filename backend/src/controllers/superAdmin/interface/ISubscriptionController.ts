import { AuthRequest } from "../../../types/common/middTypes";
import {Response } from "express";

export interface ISubscriptionController {
    createSubscriptionPlan(req: AuthRequest, res: Response): Promise<void>;
    fetchSubscriptionPlans(req: AuthRequest, res: Response): Promise<void>;
    deleteSubscriptionPlan(req: AuthRequest, res: Response): Promise<void>;
    getSubscriptionPlanById(req: AuthRequest, res: Response): Promise<void>;
}