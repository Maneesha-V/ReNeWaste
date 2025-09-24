import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IDriverController {
  addDriver(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  fetchDrivers(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getDriverById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateDriver(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteDriverById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
