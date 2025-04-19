import { Request, Response } from "express";
import { ProfileDriverRequest } from "../../../types/driver/authTypes";

export interface IProfileController {
    getProfile(req: ProfileDriverRequest, res: Response): Promise<void>;
    updateProfile(req: ProfileDriverRequest, res: Response): Promise<void>;
    getDriversByWastePlant (req: Request, res: Response): Promise<void>;
}