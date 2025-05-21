import { Request, Response } from "express";
import moment from 'moment';
import { ICommercialController } from "./interface/ICommercialController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ICommercialService } from "../../services/user/interface/ICommercialService";

@injectable()
export class CommercialController implements ICommercialController {
  constructor(
    @inject(TYPES.CommercialService)
    private commercialService: ICommercialService
  ){}
  async getCommercial(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const user = await this.commercialService.getCommercialService(userId);
      console.log("user",user);
      
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
   async checkServiceAvailable(req: AuthRequest, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
        if (!userId) {
          res.status(400).json({ message: "User ID is required" });
          return;
        }      
        const {service, wasteplantId} = req.body;

        const available = await this.commercialService.availableWasteService(service, wasteplantId);
        console.log("available",available);
        
        if (!available) {
          res.status(200).json({ available: false });
          return;
        }
    
        res.status(200).json({ available: true });
      } catch (error) {
        console.error("Error in checking service availability:", error);
        res.status(500).json({ message: "Server error, please try again later" });
      }
    }

    async updateCommercialPickup(req: AuthRequest, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
        if (!userId) {
          res.status(400).json({ message: "User ID is required" });
          return;
        }
        console.log(req.body);
        
        const updatedData = req.body;
        const pickupDateString = updatedData.pickupDate;
        const formattedDate = moment(pickupDateString, 'MM-DD-YYYY', true).toDate(); 
        if (isNaN(formattedDate.getTime())) {
          res.status(400).json({ message: "Invalid pickup date format" });
          return;
        }
    
        updatedData.pickupDate = formattedDate;
      
        const updatedUser = await this.commercialService.updateCommercialPickupService(userId, updatedData);
        console.log("updatedUser",updatedUser);
        if (!updatedUser) {
          res.status(404).json({ message: "User not found" });
          return;
        }
  
        res.status(200).json({ message: "Updated successfully", user: updatedUser });
      } catch (error) {
        console.error("Error in updation:", error);
        res.status(500).json({ message: "Server error, please try again later" });
      }
    }
}
