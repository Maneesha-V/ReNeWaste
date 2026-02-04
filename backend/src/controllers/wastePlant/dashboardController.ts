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
      console.log("query",req.query);
      
      const plantId = req.user?.id;
            const filter = req.query.filter as string;
      const from = req.query.from as string;
      const to = req.query.to as string;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const dashboardData =
        await this._dashboardService.getDashboardData({
          plantId,
          filter,
          from,
          to
        });
      // console.log("dashboardData", dashboardData);

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
