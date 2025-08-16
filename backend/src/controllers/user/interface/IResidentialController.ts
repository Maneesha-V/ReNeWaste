import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";


export interface IResidentialController {
    getResidential(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateResidentialPickup(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
