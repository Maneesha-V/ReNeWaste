import { NextFunction, Response } from "express";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { IDashboardService } from "../../services/superAdmin/interface/IDashboardService";
import { IDashboardController } from "./interface/IDashboardController";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.SuperAdminDashboardService)
    private _dashboardService: IDashboardService,
  ) {}
  async fetchSuperAdminDashboard(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: MESSAGES.COMMON.ERROR.UNAUTHORIZED });
        return;
      }

      const dashboardData =
        await this._dashboardService.fetchSuperAdminDashboard(adminId);
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
