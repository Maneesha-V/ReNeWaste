import { Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/user/interface/IPIckupService";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.UserPickupService)
    private pickupService: IPickupService
  ){}
  async getPickupPlans(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = req.user?.id; 
        console.log("user",userId);
        
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const pickups = await this.pickupService.getPickupPlanService(userId);
      console.log("pickups",pickups);
      
      res.status(200).json({ pickups });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async cancelPickupPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; 
      const { pickupReqId } = req.params;   
      
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }  
  
      const re = await this.pickupService.cancelPickupPlanService(pickupReqId);
      console.log("ree",re);
      

      res.status(200).json({ message: "Pickup canceled successfully" });
    } catch (error: any) {
      console.error("error",error);
      
      res.status(500).json({ message: "Failed to cancel pickup", error });
    }
  }

}
