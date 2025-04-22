import { Request, Response } from "express";
import PickupService from "../../services/user/pickupService";
import { IPickupController } from "./interface/IPIckupController";
import { ProfileUserRequest } from "../../types/user/authTypes";

class PickupController implements IPickupController {
  async getPickupPlans(req: ProfileUserRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.id; 
        console.log("user",userId);
        
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const pickups = await PickupService.getPickupPlanService(userId);
      res.status(200).json({ pickups });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
 export default new PickupController();