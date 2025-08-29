import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentController } from "./interface/IPaymentController";
import { IPaymentService } from "../../services/superAdmin/interface/IPaymentService";
import { AuthRequest } from "../../types/common/middTypes";
import { NextFunction, Response } from "express"
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";
import { ApiError } from "../../utils/ApiError";
@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.SuperAdminPaymentService)
    private paymentService: IPaymentService
  ) {}
   async fetchPayments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log(req.query);
        const DEFAULT_LIMIT = 5;
        const MAX_LIMIT = 50;
        const page = parseInt(req.query.page as string) || 1;
        let limit = Math.min(
          parseInt(req.query.limit as string) || DEFAULT_LIMIT,
          MAX_LIMIT
        );
        const search = (req.query.search as string) || "";
        const { total, paymentHis } =
          await this.paymentService.fetchPayments({ page, limit, search });
      
        console.log({total, paymentHis});
  
        res.status(STATUS_CODES.SUCCESS).json({
          message: MESSAGES.SUPERADMIN.SUCCESS.PAYMENT_HISTORY,
          paymentHis,
          total
        });
      } catch (error) {
        next(error);
      }
    }
    async updateRefundStatusPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log("params",req.body);
        const adminId = req.user?.id;
      if (!adminId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
        const { subPayId, refundStatus } = req.body;
         if (!subPayId || !refundStatus ) {
                throw new ApiError(
                  STATUS_CODES.BAD_REQUEST,
                  MESSAGES.COMMON.ERROR.MISSING_FIELDS
                );
              }
  
        const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
        if (!allowedStatuses.includes(refundStatus)) {
          res.status(400).json({ error: "Invalid refund status." });
          return;
        }

        const statusUpdate = await this.paymentService.updateRefundStatusPayment({
          adminId,
          subPayId,
          refundStatus,
        });
        console.log("statusUpdate", statusUpdate);
        res.status(STATUS_CODES.SUCCESS).json({
          message: MESSAGES.COMMON.SUCCESS.REFUND_UPDTAE_SUCCESS,
          statusUpdate,
        });
    
      } catch (error) {
        console.error("err", error);
        next(error);
      }
    }
    async refundPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log("params",req.body);
        const adminId = req.user?.id;
      if (!adminId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
        const { subPayId, refundStatus } = req.body;
         if (!subPayId || !refundStatus ) {
                throw new ApiError(
                  STATUS_CODES.BAD_REQUEST,
                  MESSAGES.COMMON.ERROR.MISSING_FIELDS
                );
              }
  
        const allowedStatuses = ["Pending", "Processing", "Refunded", "Rejected"];
        if (!allowedStatuses.includes(refundStatus)) {
          res.status(400).json({ error: "Invalid refund status." });
          return;
        }

        const statusUpdate = await this.paymentService.refundPayment({
          adminId,
          subPayId,
          refundStatus,
        });
        console.log("statusUpdate", statusUpdate);
        res.status(STATUS_CODES.SUCCESS).json({
          message: MESSAGES.COMMON.SUCCESS.REFUND_UPDTAE_SUCCESS,
          statusUpdate,
        });
    
      } catch (error) {
        console.error("err", error);
        next(error);
      }
    }
}