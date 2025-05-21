import { Request, Response } from "express";

export interface IDashboardController {
    fetchDashboard(req: Request, res: Response): Promise<void>;
}