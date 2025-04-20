import { Response } from "express";
import { ProfileDriverRequest } from "../../types/driver/authTypes";
import { IPickupController } from "./interface/IPIckupController";
import PickupService from "../../services/driver/pickupService";

class PickupController implements IPickupController {

async getPickupRequests (req: ProfileDriverRequest, res: Response): Promise<void> {
    try {
        const { wasteType } = req.query;
        const driverId = req.driver?.driverId;
        console.log({ wasteType, driverId });
        
        const pickups = await PickupService.getPickupRequestService({
            wasteType: wasteType as string,
            driverId: driverId as string,
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