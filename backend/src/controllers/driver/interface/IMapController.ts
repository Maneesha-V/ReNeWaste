import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IMapController {
  getETA(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}