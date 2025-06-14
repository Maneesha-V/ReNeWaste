import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/superAdmin/interface/ISubscriptionService";
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.SuperAdminSubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}
  async createSubscriptionPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log(req.body);
      const suprAdminId = req.user?.id;
      if (!suprAdminId) {
        res.status(403).json({
          success: false,
          error: "Unauthorized or invalid suprAdminId",
        });
        return;
      }

      const subptnPlanData = req.body;
      const newSubptnPlan =
        await this.subscriptionService.createSubscriptionPlan(subptnPlanData);
      console.log("newSubptnPlan", newSubptnPlan);

      res.status(201).json({ success: true, data: newSubptnPlan });
    } catch (error: any) {
      console.log("err",error);
        res
        .status(500)
        .json({ error: error.message || "Failed to create subscription plan." });
    }
  }
  async fetchSubscriptionPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subscriptionPlans =
        await this.subscriptionService.fetchSubscriptionPlans();
      console.log("subscriptionPlans", subscriptionPlans);

      res.status(200).json({
        success: true,
        message: "Fetch subscription plans successfully",
        subscriptionPlans,
      });
    } catch (error: any) {
      console.error("err", error);
      res
        .status(500)
        .json({ message: "Error fetching subscription plans.", error });
    }
  }
  async deleteSubscriptionPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      console.log("body", req.body);
      const { id } = req.params;
      const result = await this.subscriptionService.deleteSubscriptionPlan(id);

      if (!result) {
        res.status(404).json({ message: "Plan not found" });
        return;
      }

      res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error: any) {
      console.error("Error in deleting plan:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async getSubscriptionPlanById(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const subscriptionPlan =
        await this.subscriptionService.getSubscriptionPlanById(id);
      console.log("subscriptionPlan", subscriptionPlan);

      if (!subscriptionPlan) {
        res.status(404).json({ message: "Subscription Plan not found" });
        return;
      }

      res.status(200).json({ subscriptionPlan });
    } catch (error: any) {
      console.error("Error fetching subscription plan:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
  async updateSubscriptionPlanById(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    try {
      console.log("body", req.body);

      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Plan ID is required" });
        return;
      }
      const updatedData = req.body;

      const updatedSubscriptionPlan =
        await this.subscriptionService.updateSubscriptionPlanById({
          id,
          data: updatedData,
        });
      console.log("updatedSubscriptionPlan", updatedSubscriptionPlan);

      res.status(200).json({ updatedSubscriptionPlan });
    } catch (error: any) {
      console.error("Error updating subscription plan:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to update subscription plan." });
    }
  }
}
