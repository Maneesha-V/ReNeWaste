import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ICommercialController {
    getCommercial(req: AuthRequest, res: Response): Promise<void>;
    checkServiceAvailable(req: AuthRequest, res: Response): Promise<void>
    updateCommercialPickup(req: AuthRequest, res: Response): Promise<void>
}
