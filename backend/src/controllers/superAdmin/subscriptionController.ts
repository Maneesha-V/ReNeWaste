import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/superAdmin/interface/ISubscriptionService";
import { AuthRequest } from "../../types/common/middTypes";
import { NextFunction, Response } from "express";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SuperAdminSubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}
  async createSubscriptionPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body);
      const adminId = req.user?.id;
      if (!adminId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }

      const subptnPlanData = req.body;
      const newSubptnPlan =
        await this.subscriptionService.createSubscriptionPlan(subptnPlanData);
      console.log("newSubptnPlan", newSubptnPlan);

      res
        .status(STATUS_CODES.CREATED)
        .json({
          success: true,
          message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_CREATED,
        });
    } catch (error) {
      console.log("err", error);
      next(error);
    }
  }
  async fetchSubscriptionPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

      const { subscriptionPlans, total } =
        await this.subscriptionService.fetchSubscriptionPlans({
          page,
          limit,
          search,
        });
      console.log("subscriptionPlans", subscriptionPlans);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_PLANS,
        subscriptionPlans,
        total,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async deleteSubscriptionPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("body", req.body);
      const { id } = req.params;
      if (!id) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED
        );
      }
      const plan = await this.subscriptionService.deleteSubscriptionPlan(id);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_DELETED,
        plan,
      });
    } catch (error) {
      console.error("Error in deleting plan:", error);
      next(error);
    }
  }
  async getSubscriptionPlanById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED
        );
      }
      const subscriptionPlan =
        await this.subscriptionService.getSubscriptionPlanById(id);
      console.log("subscriptionPlan", subscriptionPlan);

      res.status(STATUS_CODES.SUCCESS).json({ subscriptionPlan });
    } catch (error) {
      console.error("Error fetching subscription plan:", error);
      next(error);
    }
  }
  async updateSubscriptionPlanById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED
        );
      }
      const updatedData = req.body;

      const updatedSubscriptionPlan =
        await this.subscriptionService.updateSubscriptionPlanById({
          id,
          data: updatedData,
        });
      console.log("updatedSubscriptionPlan", updatedSubscriptionPlan);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_UPDATED,
        updatedSubscriptionPlan,
      });
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      next(error);
    }
  }
}
