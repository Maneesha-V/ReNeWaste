import { AuthRequest } from "../../../types/common/middTypes";
import { NextFunction, Response } from "express";

export interface IReportController {
    getWasteReports (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    filterWasteReports (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}