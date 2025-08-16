import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IDropSpotController {
    fetchAllNearDropSpots (req: AuthRequest,res: Response, next: NextFunction): Promise<void>;
}