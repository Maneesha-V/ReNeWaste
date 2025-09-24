import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IPaymentController {
    fetchPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    createPaymentOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    fetchSubscriptionPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    retrySubscriptionPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
    updateRefundStatusPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> ;
}