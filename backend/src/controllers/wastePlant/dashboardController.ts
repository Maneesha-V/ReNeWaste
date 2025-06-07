import { Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDashboardController } from "./interface/IDashboardController";
import { IDashboardService } from "../../services/wastePlant/interface/IDashboardService";
import { AuthRequest } from "../../types/common/middTypes";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.PlantDashboardService)
    private dashboardService: IDashboardService
  ){}
  async fetchDashboardData(req: AuthRequest, res: Response): Promise<void> {
         try {
      const plantId = req.user?.id;
      if (!plantId) {
        res.status(404).json({ message: "plantId not found" });
        return;
      }

    const dashboardData = await this.dashboardService.getDashboardData(plantId);
      console.log("dashboardData",dashboardData);
      
      res.status(200).json({
        dashboardData,
        success: true
      });
    } catch (error: any) {
      console.error("err", error);
      res.status(500).json({ message: "Error fetching dashboard dat.", error });
    } 
  }
}