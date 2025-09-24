import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface ITruckController {
  fetchTruckForDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  requestTruckForDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  markTruckReturn (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
