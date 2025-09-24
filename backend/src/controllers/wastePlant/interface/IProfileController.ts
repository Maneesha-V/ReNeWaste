import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IProfileController {
    getPlantProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    viewLicenseDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
    updatePlantProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}