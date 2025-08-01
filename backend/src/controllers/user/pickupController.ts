import { Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/user/interface/IPIckupService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.UserPickupService)
    private pickupService: IPickupService
  ) {}
  async getPickupPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      console.log("user", userId);

      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }
      const pickups = await this.pickupService.getPickupPlanService(userId);
      console.log("pickups", pickups);
      if (!pickups) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: MESSAGES.COMMON.ERROR.FETCH_PICKUP_FAIL });
        return;
      }
      res.status(200).json({ pickups });
    } catch (error) {
      handleControllerError(error, res, 500);
    }
  }
  async cancelPickupPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { pickupReqId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      console.log("pickupReqId", pickupReqId);

      const re = await this.pickupService.cancelPickupPlanService(pickupReqId);
      console.log("ree", re);

      res.status(200).json({ message: "Pickup canceled successfully" });
    } catch (error: any) {
      console.error("error", error);

      res.status(500).json({ message: "Failed to cancel pickup", error });
    }
  }

  async cancelPickupReason(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        res.status(404).json({ message: "UserId not found" });
        return;
      }
      console.log({ pickupReqId, userId, reason });

      const result = await this.pickupService.cancelPickupReasonRequest({
        userId,
        pickupReqId,
        reason,
      });
      console.log("result", result);

      res.status(200).json({
        message: "Pickup request canceled successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to cancel pickup request" });
    }
  }
}
