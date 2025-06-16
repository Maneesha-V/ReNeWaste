import { Request, Response } from "express";
import TYPES from "../../config/inversify/types";
import { inject, injectable } from "inversify";
import { IDashboardService } from "../../services/superAdmin/interface/IDashboardService";
import { IDashboardController } from "./interface/IDashboardController";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.SuperAdminDashboardService)
    private dashboardService: IDashboardService
  ){}
    async fetchDashboard(req: Request,res: Response): Promise<void> {
      try { 
        // const data = await this.dashboardService.fetchDashboardData();
   
        // res.status(200).json({
        //   success: true,
        //   message: "Fetch waste plants successfully",
        //   data: data,
        // });
      }catch (error:any){
        console.error("err",error);
        res.status(500).json({ message: "Error fetching waste plants", error });
      }
    }
}
