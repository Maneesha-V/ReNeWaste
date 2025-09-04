import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { AuthRequest } from "../../types/common/middTypes";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/driver/interface/IDashboardService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.DriverDashboardService)
    private dashboardService: IDashboardService
  ) {}
  async fetchDriverDashboard(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const driverId = req.user?.id;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }

      const dashboardData = await this.dashboardService.fetchDriverDashboard(
        driverId
      );
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
  async fetchWastePlantSupport( req: AuthRequest,  res: Response, next: NextFunction): Promise<void> {
     try {
      const driverId = req.user?.id;
      if (!driverId) {
        throw new ApiError(
                 STATUS_CODES.UNAUTHORIZED,
                 MESSAGES.COMMON.ERROR.UNAUTHORIZED
               );
      }

      const supportData = await this.dashboardService.fetchWastePlantSupport(
        driverId
      );
      console.log("supportData", supportData);

      res.status(STATUS_CODES.SUCCESS).json({
        supportData,
        success: true,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
