import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
    getPickupPlans(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    cancelPickupPlan(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    cancelPickupReason(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}