import { Response } from "express";
import { AuthRequest } from "../../../types/common/middTypes";

export interface IPaymentController {
    fetchPayments(req: AuthRequest, res: Response): Promise<void>
}