import { AuthRequest } from "../../types/common/middTypes";
import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/wastePlant/interface/IPaymentService";
import { handleControllerError } from "../../utils/errorHandler";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.PlantPaymentService)
    private paymentService: IPaymentService
  ) {}
  async fetchPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { payments, total } = await this.paymentService.fetchPayments({
        plantId,
        page,
        limit,
        search,
      });
      console.log("payments", payments);

      res.status(200).json({
        success: true,
        payments,
        total,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching payments.", error });
    }
  }
  // async createPaymentOrder(req: AuthRequest, res: Response): Promise<void> {
  //   try {
  //     const plantId = req.user?.id;
  //     const { amount, planId, plantName } = req.body;
  //     console.log("plant", plantId);
  //     console.log("amount", amount, planId, plantName);
  //     if (!plantId || !amount || !planId || !plantName) {
  //       res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.COMMON.ERROR.MISSING_FIELDS });
  //       return;
  //     }
  //     const paymentOrder = await this.paymentService.createPaymentOrder({
  //       amount,
  //       planId,
  //       plantName,
  //       plantId,
  //     });
  //     console.log("paymentOrder", paymentOrder);

  //     res.status(STATUS_CODES.SUCCESS).json({ success: true, paymentOrder });
  //   } catch (error) {
  //    console.error("error", error);
  //     handleControllerError(error, res, 500);
  //   }
  // }
  async createPaymentOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { planId } = req.body;

      console.log("plant", plantId);
      console.log("amount", planId);
      if (!plantId || !planId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.MISSING_FIELDS });
        return;
      }
      const paymentOrder = await this.paymentService.createPaymentOrder({
        planId,
        plantId,
      });
      console.log("paymentOrder", paymentOrder);

      res.status(STATUS_CODES.SUCCESS).json({ success: true, paymentOrder });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }
  async verifyPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const paymentDetails = req.body.paymentData;
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(401).json({ error: "PlantId is required." });
        return;
      }
      const updatePayment = await this.paymentService.verifyPaymentService({
        paymentData: paymentDetails,
        plantId,
      });

        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.WASTEPLANT.SUCCESS.PAYMENT,
          updatePayment
        });

    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async fetchSubscriptionPayments(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      console.log("plantId", plantId);

      if (!plantId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const payments = await this.paymentService.fetchSubscriptionPayments(
        plantId
      );
      console.log("payments", payments);

      res.status(STATUS_CODES.SUCCESS).json({ success: true, payments });
    } catch (error) {
      console.error("error", error);
      handleControllerError(error, res, 500);
      // res.status(400).json({
      //   success: false,
      //   message: err.message || "Fetch payments failed",
      // });
    }
  }

  async retrySubscriptionPayment(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { planId, amount, subPaymtId } = req.body;
      console.log("body", req.body);
      if (!plantId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }

      const repaymentOrder = await this.paymentService.retrySubscriptionPayment(
        { plantId, planId, amount, subPaymtId }
      );
      console.log("repaymentOrder", repaymentOrder);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.RETRY_ORDER_PAY_SUCCESS,
        repaymentOrder,
      });
    } catch (error) {
      console.error("error", error);
      handleControllerError(error, res, 500);
      // res.status(500).json({
      //   success: false,
      //   message: "Payment retry failed.",
      //   error: error.message,
      // });
    }
  }
  async updateRefundStatusPayment(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(401).json({ error: "PlantId is required." });
        return;
      }
      console.log("body", req.body);

      const statusUpdateData = req.body.statusUpdateData;

      const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
      if (!allowedStatuses.includes(statusUpdateData.status)) {
        res.status(400).json({ error: "Invalid refund status." });
        return;
      }

      const statusUpdate = await this.paymentService.updateRefundStatusPayment({
        plantId,
        statusUpdateData,
      });
      console.log("statusUpdate", statusUpdate);
      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.REFUND_UPDTAE_SUCCESS,
        statusUpdate,
      });
      // res.status(200).json({
      //   success: true,
      //   message: "Update refund status successfully.",
      //   statusUpdate
      // });
    } catch (error: any) {
      console.error("err", error);
      handleControllerError(error, res, 500);
      // res.status(500).json({
      //   success: false,
      //   message: "Update refund status failed.",
      //   error: error.message,
      // });
    }
  }
  async refundPayment(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(401).json({ error: "PlantId is required." });
        return;
      }
      console.log("body", req.body);

      const refundData = req.body;

      const updatedData = await this.paymentService.refundPayment(
        plantId,
        refundData
      );
      console.log("updatedData", updatedData);

      res.status(200).json({
        success: true,
        message: "Refund process success.",
        updatedData,
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({
        success: false,
        message: "Refund process failed.",
        error: error.message,
      });
    }
  }
}
