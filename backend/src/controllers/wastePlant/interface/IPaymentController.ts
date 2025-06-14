import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPaymentController {
    fetchPayments(req: AuthRequest, res: Response): Promise<void>;
    createPaymentOrder(req: AuthRequest, res: Response): Promise<void>;
    verifyPayment(req: AuthRequest, res: Response): Promise<void>;
    fetchSubscriptionPayments(req: AuthRequest, res: Response): Promise<void>;
    retrySubscriptionPayment(req: AuthRequest, res: Response): Promise<void>;
    updateRefundStatusPayment(req: AuthRequest, res: Response): Promise<void> ;
}