import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";
import { IReportController } from "./interface/IReportController";
import { IReportService } from "../../services/wastePlant/interface/IReportService";

@injectable()
export class ReportController implements IReportController {
  constructor(
    @inject(TYPES.PlantReportService)
    private reportService: IReportService
  ) {}
  async getWasteReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const plantId = req.user?.id;

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const wasteReports = await this.reportService.getWasteReports(plantId);
      console.log("wasteReports",wasteReports);
      
      res.status(200).json({
        success: true,
        message: "Fetch waste reports successfully",
        wasteReports,
      });
    } catch (error: any) {
      console.error("Controller Error:", error);
      res.status(500).json({ message: "Failed to fetch waste reports" });
    }
  }
  async filterWasteReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { from, to } = req.params;
      const plantId = req.user?.id;
      console.log({ from, to, plantId });

      if (!plantId) {
        res.status(400).json({ message: "Plant ID is required" });
        return;
      }
      const reports = await this.reportService.filterWasteReports({
        from,
        to,
        plantId,
      });

      res.status(200).json({
        success: true,
        message: "Fetch filter waste reports successfully",
        reports,
      });
    } catch (error: any) {
      console.error("Controller Error:", error);
      res.status(500).json({ message: "Failed to filter waste reports" });
    }
  }
}
