import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IProfileController {
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    getDriversByWastePlant (req: Request, res: Response): Promise<void>;
}