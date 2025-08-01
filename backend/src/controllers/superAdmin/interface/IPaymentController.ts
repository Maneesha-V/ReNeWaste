import { AuthRequest } from "../../../types/common/middTypes";
import { Response } from "express";

export interface IPaymentController {
    fetchPayments(req: AuthRequest, res: Response): Promise<void>
}