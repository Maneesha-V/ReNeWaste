import { Request, Response } from "express";

export interface IWastePlantController {
    fetchDashboard(req: Request, res: Response): Promise<void>;
}