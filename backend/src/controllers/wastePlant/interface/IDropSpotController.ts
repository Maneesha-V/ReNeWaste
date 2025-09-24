import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IDropSpotController {
  createDropSpot(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  fetchDropSpots(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  fetchDropSpotById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteDropSpotById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateDropSpot(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
