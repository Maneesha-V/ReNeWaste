import { AuthRequest } from "../../../types/common/middTypes";
import { NextFunction, Response } from "express";

export interface IPaymentController {
    fetchPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateRefundStatusPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}