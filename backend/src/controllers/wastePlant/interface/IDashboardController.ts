import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IDashboardController {
    fetchDashboardData(req: AuthRequest, res: Response): Promise<void>;
}