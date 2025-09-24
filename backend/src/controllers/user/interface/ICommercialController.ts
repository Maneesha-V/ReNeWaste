import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface ICommercialController {
  getCommercial(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  checkServiceAvailable(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateCommercialPickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
