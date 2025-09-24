import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IReportController {
    getWasteReports (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    filterWasteReports (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}