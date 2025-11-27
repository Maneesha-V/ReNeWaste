import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IWalletController {
    getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}