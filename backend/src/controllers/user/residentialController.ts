import { Request, Response } from "express";
import { ResidentialRequest } from "../../types/user/residentialTypes";
import { IResidentialController } from "./interface/IResidentialController";
import ResidentialService from "../../services/user/residentialService";

class ResidentialController implements IResidentialController {
  async getResidential(req: ResidentialRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }    
      const user = await ResidentialService.getResidentialService(userId);
      console.log("user",user);
      
      res.status(200).json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
    async updateResidentialPickup(req: ResidentialRequest, res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
        if (!userId) {
          res.status(400).json({ message: "User ID is required" });
          return;
        }
        const updatedData = req.body;
        const updatedUser = await ResidentialService.updateResidentialPickupService(userId, updatedData);
  
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
export default new ResidentialController();