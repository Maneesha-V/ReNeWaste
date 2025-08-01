import { Request, Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IPaymentController } from "./interface/IPaymentController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "../../services/user/interface/IPaymentService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.UserPaymentService)
    private paymentService: IPaymentService
  ) {}
  async createPaymentOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, pickupReqId } = req.body.paymentData;
      console.log("user", userId);
      console.log("amount", amount, pickupReqId);
      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const paymentOrder = await this.paymentService.createPaymentOrderService({
        amount,
        pickupReqId,
        userId,
      });
      console.log("paymentOrder", paymentOrder);
      if (!paymentOrder) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: MESSAGES.COMMON.ERROR.CREATE_PAYMENT_FAIL,
        });
        return;
      }
      res.status(STATUS_CODES.CREATED).json(paymentOrder);
    } catch (error) {
      handleControllerError(error, res, 500);
      console.error("err", error);
      // res.status(500).json({
      //   success: false,
      //   message: error.message || "Payment creation failed",
      // });
    }
  }
  async verifyPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("body", req.body);

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        pickupReqId,
        amount,
      } = req.body.paymentData;
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const updatedPayment = await this.paymentService.verifyPaymentService({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        pickupReqId,
        amount,
        userId,
      });
      if (!updatedPayment) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: MESSAGES.COMMON.ERROR.VERIFY_PAYMENT_FAIL,
        });
        return;
      }
      console.log("updatedPayment", updatedPayment);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.PAYMENT_SUCCESSFUL,
        updatedPayment,
      });
    } catch (error) {
      console.error("error", error);
      handleControllerError(error, res, 500);
      // const msg = err instanceof Error ? err.message : "Verification failed";
      // res.status(STATUS_CODES.NOT_FOUND).json({
      //   success: false,
      //   message: msg,
      // });
    }
  }

  async getAllPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const payments = await this.paymentService.getAllPaymentsService(userId);
      if (!payments) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.COMMON.ERROR.FETCH_PAYMENT_FAIL });
        return;
      }
      console.log("payments", payments);

      res.status(STATUS_CODES.SUCCESS).json({ success: true, payments });
    } catch (error) {
      handleControllerError(error, res, 500);
      // res.status(400).json({
      //   success: false,
      //   message: err.message || "Fetch payments failed",
      // });
    }
  }

  async rePayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("bbbb", req.body);

      const userId = req.user?.id;

      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const { pickupReqId, amount } = req.body;

      const repaymentOrder = await this.paymentService.rePaymentService(
        userId,
        pickupReqId,
        amount
      );
      console.log("repaymentOrder", repaymentOrder);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Payment retry successful.",
        repaymentOrder,
      });
    } catch (error) {
      handleControllerError(error, res, 500);
      // res.status(500).json({ message: error.message || "Internal server error" });
      // res.status(500).json({
      //   success: false,
      //   message: "Payment retry failed.",
      //   error: error.message,
      // });
    }
  }
}
