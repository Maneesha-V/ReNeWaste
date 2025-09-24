import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/wastePlant/interface/IDashboardService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.PlantDashboardService)
    private _dashboardService: IDashboardService,
  ) {}
  async fetchDashboardData(
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

      const dashboardData =
        await this._dashboardService.getDashboardData(plantId);
      console.log("dashboardData", dashboardData);

      res.status(STATUS_CODES.SUCCESS).json({
        dashboardData,
        success: true,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
