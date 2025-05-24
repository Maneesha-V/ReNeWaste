import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
  getPickupRequests(req: AuthRequest, res: Response): Promise<void>;
  getPickupRequestById(req: AuthRequest, res: Response): Promise<void>;
  updateAddressLatLng(req: AuthRequest, res: Response): Promise<void>;
  updateTrackingStatus(req: AuthRequest, res: Response): Promise<void>;
  markPickupCompleted(req: AuthRequest, res: Response): Promise<void>;
}
