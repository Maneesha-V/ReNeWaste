import { Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import ProfileService from "../../services/driver/profileService";
import { AuthRequest } from "../../types/common/middTypes";

class ProfileController implements IProfileController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user?.id;     
      if (!driverId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const driver = await ProfileService.getDriverProfile(driverId);
      res.status(200).json({ driver });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user?.id;   
    const updatedData = req.body;
  if (!driverId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const updatedDriver = await ProfileService.updateDriverProfile(driverId, updatedData);
  res.status(200).json({ driver: updatedDriver });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
  }
  async getDriversByWastePlant (req: Request, res: Response): Promise<void> {
    try {
      const wastePlantId = req.query.wastePlantId as string;
  
      if (!wastePlantId) {
         res.status(400).json({ message: "wastePlantId is required" });
         return;
      }
      const drivers = await ProfileService.fetchDriversService(wastePlantId)
      
      res.status(200).json({data:drivers});
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Server error while fetching drivers" });
    }
  };
}
export default new ProfileController();
