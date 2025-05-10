import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
    getPickupPlans(req: AuthRequest, res: Response): Promise<void>
}