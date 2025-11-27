import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IDashboardController {
  fetchDriverDashboard(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  fetchWastePlantSupport(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
    markAttendance(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
    fetchDriverEarnStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  
}
