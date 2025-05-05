import { Request, Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface ITruckController {
    requestTruckForDriver(req: AuthRequest, res: Response): Promise<void>;

}