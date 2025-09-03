import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { AuthRequest } from "../../types/common/middTypes";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/driver/interface/IDashboardService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
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
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
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
