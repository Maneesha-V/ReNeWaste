import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ITruckController {
  fetchTruckForDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  requestTruckForDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  markTruckReturn (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
