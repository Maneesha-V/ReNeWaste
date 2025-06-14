import { AuthRequest } from "../../../types/common/middTypes";
import { Response } from "express";

export interface ISubscriptionController {
    fetchSubscriptionPlan(req: AuthRequest, res:Response) :Promise<void>;
}