import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IDashboardController {
    fetchSuperAdminDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}