import { NextFunction, Request, Response } from "express";
import { IPaymentController } from "./interface/IPaymentController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "../../services/user/interface/IPaymentService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class PaymentController implements IPaymentController {
  constructor(
    @inject(TYPES.UserPaymentService)
    private _paymentService: IPaymentService,
  ) {}
  async createPaymentOrder(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { amount, pickupReqId, method } = req.body.paymentData;
      console.log("user", userId);
      console.log("amount", amount, pickupReqId, method);
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const paymentOrder = await this._paymentService.createPaymentOrderService(
        {
          amount,
          pickupReqId,
          userId,
          method
        },
      );
      console.log("paymentOrder", paymentOrder);
      if (!paymentOrder) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.CREATE_PAYMENT_FAIL,
        );
      }
      res.status(STATUS_CODES.CREATED).json(paymentOrder);
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async verifyPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const updatedPayment = await this._paymentService.verifyPaymentService({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        pickupReqId,
        amount,
        userId,
      });
      if (!updatedPayment) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.VERIFY_PAYMENT_FAIL,
        );
      }
      console.log("updatedPayment", updatedPayment);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.PAYMENT_SUCCESSFUL,
        updatedPayment,
      });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }

  async getAllPayments(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 50;
      const page = parseInt(req.query.page as string) || 1;
      let limit = Math.min(
        parseInt(req.query.limit as string) || DEFAULT_LIMIT,
        MAX_LIMIT,
      );
      const search = (req.query.search as string) || "";
      const filter = (req.query.filter as string) || "All";

      const paginationData: PaginationInput = {
        page,
        limit,
        search,
        filter,
      };

      const { payments, total } = await this._paymentService.getAllPayments(
        userId,
        paginationData,
      );
      if (!payments) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.FETCH_PAYMENT_FAIL,
        );
      }
      console.log("payments", payments);

      res.status(STATUS_CODES.SUCCESS).json({ payments, total });
    } catch (error) {
      next(error);
    }
  }

  async rePayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("bbbb", req.body);

      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const { pickupReqId, amount } = req.body;

      const repaymentOrder = await this._paymentService.rePaymentService(
        userId,
        pickupReqId,
        amount,
      );
      console.log("repaymentOrder", repaymentOrder);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Payment retry successful.",
        repaymentOrder,
      });
    } catch (error) {
      next(error);
    }
  }
  async verifyWalletPickupPayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try{
    console.log("body", req.body);
     const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const walletPickupPayResp = await this._paymentService.verifyWalletPickupPayment(userId,req.body.paymentData);

      console.log("walletPickupPayResp",walletPickupPayResp);
      
       res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.WALLET_PAYMENT_SUCCESS,
        walletPickupPayResp,
      });
    } catch(error){
      next(error);
    }
  }
}
