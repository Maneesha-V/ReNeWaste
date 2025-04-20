import { Response } from "express";
import { ProfileDriverRequest } from "../../../types/driver/authTypes";

export interface IPickupController {
    getPickupRequests (req: ProfileDriverRequest, res: Response): Promise<void>;
}