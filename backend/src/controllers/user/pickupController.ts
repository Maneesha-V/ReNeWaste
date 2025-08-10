import { NextFunction, Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/user/interface/IPIckupService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { handleControllerError } from "../../utils/errorHandler";
import { ApiError } from "../../utils/ApiError";
import { PaginationInput } from "../../dtos/common/commonDTO";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.UserPickupService)
    private _pickupService: IPickupService
  ) {}
  async getPickupPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log("query", req.query);
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const DEFAULT_LIMIT = 5;
      const MAX_LIMIT = 50;
      const page = parseInt(req.query.page as string) || 1;
      let limit = Math.min(
        parseInt(req.query.limit as string) || DEFAULT_LIMIT,
        MAX_LIMIT
      );
      const search = (req.query.search as string) || "";
      const filter = (req.query.filter as string) || "All";

      const paginationData: PaginationInput = {
        page,
        limit,
        search,
        filter,
      };

      const { pickups, total } = await this._pickupService.getPickupPlanService(
        userId,
        paginationData
      );

      res.status(STATUS_CODES.SUCCESS).json({ pickups, total });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async cancelPickupPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { pickupReqId } = req.params;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      console.log("pickupReqId", pickupReqId);

      const re = await this._pickupService.cancelPickupPlanService(pickupReqId);
      console.log("ree", re);

      res.status(200).json({ message: "Pickup canceled successfully" });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }

  async cancelPickupReason(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      console.log({ pickupReqId, userId, reason });

      const result = await this._pickupService.cancelPickupReasonRequest({
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
      console.error("error", error);
      next(error);
    }
  }
}
