import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPickupController {
    getPickupRequests (req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    approvePickup(req: Request, res: Response): Promise<void>;
    cancelPickup(req: Request, res: Response): Promise<void>;
    reschedulePickup(req: Request, res: Response): Promise<void>;
    fetchDriversByPlace (req: AuthRequest, res: Response): Promise<void>;
}