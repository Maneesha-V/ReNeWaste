import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
    getPickupRequests (req: AuthRequest, res: Response): Promise<void>;
    updateAddressLatLng (req: AuthRequest, res: Response): Promise<void>;
}