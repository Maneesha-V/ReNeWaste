import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/wastePlant/interface/ISubscriptionService";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { IPaymentService } from "../../services/wastePlant/interface/IPaymentService";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.PlantSubscriptionService)
    private _subscriptionService: ISubscriptionService,
    @inject(TYPES.PlantPaymentService)
    private _paymentService: IPaymentService,
  ) {}
  async fetchSubscriptionPlan(
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

      const selectedPlan =
        await this._subscriptionService.fetchSubscriptionPlan(plantId);
      console.log("selectedPlan", selectedPlan);
      const subPaymentHistory =
        await this._paymentService.fetchSubscriptionPayments(plantId);
      console.log("subPaymentHistory", subPaymentHistory);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.SUBSCRIPTION_PLAN,
        selectedPlan,
        subPaymentHistory,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async fetchSubscriptionPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.WASTEPLANT.ERROR.ID_REQUIRED,
        );
      }

      const subscriptionPlans =
        await this._subscriptionService.fetchSubscriptionPlans(plantId);
      console.log("subscriptionPlans", subscriptionPlans);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_PLANS,
        subscriptionPlans,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async cancelSubcptReason(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { subPayId } = req.params;
      const { reason } = req.body;
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      console.log({ subPayId, plantId, reason });

      const payment = await this._subscriptionService.cancelSubcptReason(
        plantId,
        subPayId,
        reason,
      );
      console.log("payment", payment);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.WASTEPLANT.SUCCESS.SUBSCRIPTION_CANCEL,
        payment,
      });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }
}
