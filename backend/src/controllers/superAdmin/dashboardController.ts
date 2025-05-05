import { Request, Response } from "express";
import DashboardService from "../../services/superAdmin/dashboardService";

class DashboardController implements DashboardController {

    async fetchDashboard(req: Request,res: Response): Promise<void> {
      try { 
        const data = await DashboardService.fetchDashboardData();
   
        res.status(200).json({
          success: true,
          message: "Fetch waste plants successfully",
          data: data,
        });
      }catch (error:any){
        console.error("err",error);
        res.status(500).json({ message: "Error fetching waste plants", error });
      }
    }
}
export default new DashboardController();