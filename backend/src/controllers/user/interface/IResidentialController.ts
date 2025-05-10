import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IResidentialController {
    getResidential(req: AuthRequest, res: Response): Promise<void>;
    updateResidentialPickup(req: AuthRequest, res: Response): Promise<void>;
}
