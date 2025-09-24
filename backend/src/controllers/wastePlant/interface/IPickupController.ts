import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IPickupController {
  getPickupRequests(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  approvePickup(req: Request, res: Response, next: NextFunction): Promise<void>;
  cancelPickup(req: Request, res: Response, next: NextFunction): Promise<void>;
  reschedulePickup(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  fetchDriversByPlace(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
