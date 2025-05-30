import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ITruckController {
  fetchTruckForDriver(req: AuthRequest, res: Response): Promise<void>;
  requestTruckForDriver(req: AuthRequest, res: Response): Promise<void>;
  markTruckReturn (req: AuthRequest, res: Response): Promise<void>;
}
