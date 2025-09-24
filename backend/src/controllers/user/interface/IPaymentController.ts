import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../dtos/base/BaseDTO";

export interface IPaymentController {
  createPaymentOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  verifyPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getAllPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  rePayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}
