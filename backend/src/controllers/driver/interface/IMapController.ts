import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IMapController {
  getETA(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}