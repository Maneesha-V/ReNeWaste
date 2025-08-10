import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/wastePlant/interface/ISubscriptionService";
import { AuthRequest } from "../../types/common/middTypes";
import { NextFunction, Response } from "express";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.PlantSubscriptionService)
    private _subscriptionService: ISubscriptionService
  ) {}
  async fetchSubscriptionPlan(req: AuthRequest, res:Response) :Promise<void> {
      try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }


      const selectedPlan = await this._subscriptionService.fetchSubscriptionPlan(
        plantId
      );
      console.log("selectedPlan", selectedPlan);

      res.status(200).json({
        success: true,
        message: "Fetch subscription plan successfully",
        selectedPlan
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching insubscription plan.", error });
    }
  }
  async fetchSubscriptionPlans(req: AuthRequest, res:Response, next: NextFunction) :Promise<void> {
     try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.WASTEPLANT.ERROR.ID_REQUIRED)
      }


      const subscriptionPlans = await this._subscriptionService.fetchSubscriptionPlans(
        plantId
      );
      console.log("subscriptionPlans", subscriptionPlans);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUPERADMIN.SUCCESS.SUBSCRIPTION_PLANS,
        subscriptionPlans
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}