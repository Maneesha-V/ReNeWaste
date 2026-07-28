import { Request, Response, NextFunction } from "express";

export interface IHomeController {
  searchLocation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  checkWPServiceAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  checkCurrentLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
