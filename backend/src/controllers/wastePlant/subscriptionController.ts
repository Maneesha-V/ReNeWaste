import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/wastePlant/interface/ISubscriptionService";
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject(TYPES.PlantSubscriptionService)
    private subscriptionService: ISubscriptionService
  ) {}
  async fetchSubscriptionPlan(req: AuthRequest, res:Response) :Promise<void> {
      try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }


      const selectedPlan = await this.subscriptionService.fetchSubscriptionPlan(
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
}