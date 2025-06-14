import { AuthRequest } from "../../../types/common/middTypes";
import { Response } from "express";

export interface IReportController {
    getWasteReports (req: AuthRequest, res: Response): Promise<void>;
    filterWasteReports (req: AuthRequest, res: Response): Promise<void>;
}