import { NextFunction, Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/user/interface/IPIckupService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.UserPickupService)
    private _pickupService: IPickupService,
  ) {}
  async getPickupPlans(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("query", req.query);
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

      const { pickups, total } = await this._pickupService.getPickupPlanService(
        userId,
        paginationData,
      );
      console.log("pickups", pickups);

      res.status(STATUS_CODES.SUCCESS).json({ pickups, total });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async cancelPickupPlan(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const { pickupReqId } = req.params;

      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const success =
        await this._pickupService.cancelPickupPlanService(pickupReqId);
      if (success) {
        res
          .status(STATUS_CODES.SUCCESS)
          .json({ message: MESSAGES.USER.SUCCESS.PICKUP_CANCEL });
      } else {
        res
          .status(STATUS_CODES.SERVER_ERROR)
          .json({ message: MESSAGES.USER.ERROR.PICKUP_CANCEL });
      }
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }

  async cancelPickupReason(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const { reason } = req.body;
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      console.log({ pickupReqId, userId, reason });

      const payment = await this._pickupService.cancelPickupReasonRequest({
        userId,
        pickupReqId,
        reason,
      });
      console.log("payment", payment);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.USER.SUCCESS.PICKUP_CANCEL,
        payment,
      });
    } catch (error) {
      console.error("error", error);
      next(error);
    }
  }
}
