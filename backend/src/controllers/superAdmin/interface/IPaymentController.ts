import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IPaymentController {
  fetchPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateRefundStatusPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  refundPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
