import { Request, Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IPaymentController } from "./interface/IPaymentController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "../../services/user/interface/IPaymentService";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.UserPaymentService)
    private paymentService: IPaymentService
  ){}
  async createPaymentOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, pickupReqId } = req.body;
      console.log("user", userId);
      console.log("amount", amount, pickupReqId);
      if (!userId || !amount || !pickupReqId) {
        res.status(401).json({ error: "Fields are required." });
        return;
      }
      const paymentOrder = await this.paymentService.createPaymentOrderService(
        amount,
        pickupReqId,
        userId
      );
      console.log("paymentOrder", paymentOrder);

      res.status(201).json({ success: true, paymentOrder });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({
          success: false,
          message: error.message || "Payment creation failed",
        });
    }
  }
  async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paymentDetails = req.body.paymentData;
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: "UserId is required." });
        return;
      }
      const result = await this.paymentService.verifyPaymentService(
        paymentDetails,
        userId
      );
      console.log("result",result);
      
      res
        .status(200)
        .json({
          success: true,
          message: "Payment verified",
          paymentOrder: result,
        });
    } catch (err: any) {
      console.error("err",err)
      res
        .status(400)
        .json({
          success: false,
          message: err.message || "Verification failed",
        });
    }
  }

  async getAllPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("userId", userId);

      if (!userId) {
        res.status(401).json({ error: "UserId is required." });
        return;
      }
      const payments = await this.paymentService.getAllPaymentsService(userId);
      console.log("payments", payments);

      res.status(201).json({ success: true, payments });
    } catch (err: any) {
      res
        .status(400)
        .json({
          success: false,
          message: err.message || "Fetch payments failed",
        });
    }
  }

  async rePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("userId", userId);

      if (!userId) {
        res.status(401).json({ error: "UserId is required." });
        return;
      }
      const { pickupReqId, amount } = req.body;

      const repaymentOrder = await this.paymentService.rePaymentService(userId, pickupReqId, amount);
      console.log("repaymentOrder",repaymentOrder);
      
      res.status(200).json({
        success: true,
        message: "Payment retry successful.",
        repaymentOrder,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Payment retry failed.",
        error: error.message,
      });
    }
  }
}

