import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
  getPickupRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getPickupRequestById(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  updateAddressLatLng(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  updateTrackingStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  markPickupCompleted(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
