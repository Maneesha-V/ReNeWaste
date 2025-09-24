import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { NextFunction, Response } from "express";
import { IReportController } from "./interface/IReportController";
import { IReportService } from "../../services/wastePlant/interface/IReportService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class ReportController implements IReportController {
  constructor(
    @inject(TYPES.PlantReportService)
    private reportService: IReportService
  ) {}
  async getWasteReports(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        throw new ApiError(
                 STATUS_CODES.UNAUTHORIZED,
                 MESSAGES.COMMON.ERROR.UNAUTHORIZED
               );
      }
      const wasteReports = await this.reportService.getWasteReports(plantId);
      console.log("wasteReports",wasteReports);
      
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_WASTE_REPORT,
        wasteReports,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      next(error);
    }
  }
  async filterWasteReports(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { from, to } = req.params;
      const plantId = req.user?.id;
      console.log({ from, to, plantId });

      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const reports = await this.reportService.filterWasteReports({
        from,
        to,
        plantId,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_FILTER_WASTE_REPORT,
        reports,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      next(error);
    }
  }
}
