import { Request, Response } from "express";
import PickupService from "../../services/wastePlant/pickupService";
import { IPickupController } from "./interface/IPickupController";
import { ProfilePlantRequest } from "../../types/wastePlant/authTypes";

class PickupController implements IPickupController {

async getPickupRequests (req: ProfilePlantRequest, res: Response): Promise<void> {
    try {
        const { status, wasteType } = req.query;
        const plantId = req.wastePlant?.plantId;
        console.log({ status, wasteType, plantId });
        
        const pickups = await PickupService.getPickupRequestService({
            status: status as string,
            wasteType: wasteType as string,
            plantId: plantId as string,
          });
          console.log("pickups",pickups);
          
        res.status(200).json({
          success: true,
          data: pickups,
        });
      } catch (error) {
        console.error('Error fetching pickups:', error);
        res.status(500).json({ message: 'Server error' });
      }
}
}
export default new PickupController();