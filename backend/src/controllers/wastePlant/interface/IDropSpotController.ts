import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IDropSpotController {
    createDropSpot(req: AuthRequest, res: Response): Promise<void>;
}