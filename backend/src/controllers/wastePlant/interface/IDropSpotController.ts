import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IDropSpotController {
  createDropSpot(req: AuthRequest, res: Response): Promise<void>;
  fetchDropSpots(req: AuthRequest, res: Response): Promise<void>;
  fetchDropSpotById(req: AuthRequest, res: Response): Promise<void>;
  deleteDropSpotById(req: AuthRequest, res: Response): Promise<void>;
  updateDropSpot(req: AuthRequest, res: Response): Promise<void>;
}
