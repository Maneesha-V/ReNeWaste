import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IMapController {
  getETA(req: AuthRequest, res: Response): Promise<void>;
}