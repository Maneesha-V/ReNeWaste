import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IProfileController {
    getPlantProfile(req: AuthRequest, res: Response): Promise<void>;
    viewLicenseDocument(req: Request, res: Response): Promise<void>;
    updatePlantProfile(req: AuthRequest, res: Response): Promise<void>;
}