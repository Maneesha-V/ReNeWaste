import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IWalletController {
    createAddMoneyOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    verifyWalletAddPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    retryWalletAddPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}