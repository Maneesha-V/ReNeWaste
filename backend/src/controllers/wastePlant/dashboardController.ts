import { Response } from "express";
import { inject, injectable } from "inversify";
import { IDashboardController } from "./interface/IDashboardController";
import TYPES from "../../config/inversify/types";
import { IDashboardService } from "../../services/wastePlant/interface/IDashboardService";
import { AuthRequest } from "../../types/common/middTypes";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.PlantDashboardService)
    private dashboardService: IDashboardService
  ) {}
  async getWastePlantDashboard(req: AuthRequest, res: Response): Promise<void> {
      try {
        const plantId = req.user?.id;
        if(!plantId){
        res.status(404).json({ message: "PlantId not found" });
        return;
        }
    const dashboardStats = await this.dashboardService.fetchWastePlantDashboard(plantId);
    res.status(200).json({
      success: true,
      dashboardStats,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
  }
}