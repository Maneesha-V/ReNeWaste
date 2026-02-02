import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/driver/interface/IDashboardService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.DriverDashboardService)
    private _dashboardService: IDashboardService,
  ) {}
  async fetchDriverDashboard(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user?.id;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const dashboardData =
        await this._dashboardService.fetchDriverDashboard(driverId);
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
  async fetchWastePlantSupport(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user?.id;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const supportData =
        await this._dashboardService.fetchWastePlantSupport(driverId);
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
  async markAttendance(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user?.id;
      console.log("body",req.body);
      
      const status = req.body.status;
      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const result =
        await this._dashboardService.markAttendance(driverId, status);
      console.log("result", result);

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.DRIVER.SUCCESS.MARK_ATTENDANCE,
        success: true,
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
  async fetchDriverEarnStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction, 
  ): Promise<void> {
        try {
      const driverId = req.user?.id;
      console.log("query",req.query);

      const filter = req.query.filter as string;
      const from = req.query.from as string;
      const to = req.query.to as string;

      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const earnRewardStats =
        await this._dashboardService.fetchDriverEarnStats({
          driverId, 
          filter,
          from,
          to
        });
      console.log("earnRewardStats", earnRewardStats);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        earnRewardStats
      });
    } catch (error) {
      console.error("err", error);
      next(error);
    }
  }
}
