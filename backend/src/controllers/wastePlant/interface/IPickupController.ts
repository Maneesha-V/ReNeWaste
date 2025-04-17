import { Request, Response } from "express";
import { ProfilePlantRequest } from "../../../types/wastePlant/authTypes";

export interface IPickupController {
    getPickupRequests (req: ProfilePlantRequest, res: Response): Promise<void>;
}