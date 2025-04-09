import { Request, Response } from "express";
import { IProfileController } from "./interface/IProfileController";
import ProfileService from "../../services/driver/profileService";
import { ProfileDriverRequest } from "../../types/driver/authTypes";

class ProfileController implements IProfileController {
  async getProfile(req: ProfileDriverRequest, res: Response): Promise<void> {
    try {
      console.log("req",req.driver);
      const driverId = req.driver?.driverId;     
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
  async updateProfile(req: ProfileDriverRequest, res: Response): Promise<void> {
    try {
    const driverId = req.driver?.driverId;
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
}
export default new ProfileController();
