import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/wastePlant/interface/IPaymentService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.PlantPaymentService)
    private _paymentService: IPaymentService,
  ) {}
  async fetchPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";

      const { payments, total } = await this._paymentService.fetchPayments({
        plantId,
        page,
        limit,
        search,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        payments,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }

  async createPaymentOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { planId } = req.body;

      if (!plantId || !planId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS,
        );
      }
      const paymentOrder = await this._paymentService.createPaymentOrder({
        planId,
        plantId,
      });

      res.status(STATUS_CODES.SUCCESS).json({ success: true, paymentOrder });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }
  async verifyPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const paymentDetails = req.body.paymentData;
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const updatePayment = await this._paymentService.verifyPaymentService({
        paymentData: paymentDetails,
        plantId,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.PAYMENT,
        updatePayment,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async fetchSubscriptionPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const payments =
        await this._paymentService.fetchSubscriptionPayments(plantId);

      res.status(STATUS_CODES.SUCCESS).json({ success: true, payments });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }

  async retrySubscriptionPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;
      const { planId, amount, subPaymtId } = req.body;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const repaymentOrder =
        await this._paymentService.retrySubscriptionPayment({
          plantId,
          planId,
          amount,
          subPaymtId,
        });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.RETRY_ORDER_PAY_SUCCESS,
        repaymentOrder,
      });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }
  async updateRefundStatusPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const statusUpdateData = req.body.statusUpdateData;

      const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
      if (!allowedStatuses.includes(statusUpdateData.status)) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.INVALID_REFUND_STATUS,
        );
      }

      const statusUpdate = await this._paymentService.updateRefundStatusPayment(
        {
          plantId,
          statusUpdateData,
        },
      );

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.REFUND_UPDTAE_SUCCESS,
        statusUpdate,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async refundPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const refundData = req.body;

      const updatedData = await this._paymentService.refundPayment(
        plantId,
        refundData,
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.REFUND_SUCCESS,
        updatedData,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
