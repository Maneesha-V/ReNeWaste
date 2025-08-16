import { NextFunction, Response } from "express";
import { IDropSpotController } from "./interface/IDropSpotController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDropSpotService } from "../../services/user/interface/IDropSpotservice";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

injectable();
export class DropSpotController implements IDropSpotController {
  constructor(
    @inject(TYPES.UserDropSpotService)
    private dropSpotService: IDropSpotService
  ) {}
  async fetchAllNearDropSpots(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const dropspots = await this.dropSpotService.getAllNearDropSpots(userId);
      console.log("dropspots", dropspots);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.USER.SUCCESS.FETCH_DROPSPOTS,
        dropspots,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
