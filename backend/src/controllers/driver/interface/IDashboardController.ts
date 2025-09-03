import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IDashboardController {
    fetchDriverDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    fetchWastePlantSupport(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}