import { Response } from "express";
import { ProfileDriverRequest } from "../../types/driver/authTypes";
import { IPickupController } from "./interface/IPIckupController";
import PickupService from "../../services/driver/pickupService";

class PickupController implements IPickupController {

async getPickupRequests (req: ProfileDriverRequest, res: Response): Promise<void> {
    try {
        const { wasteType } = req.query;
        const driverId = req.driver?.driverId;
        const pickups = await PickupService.getPickupRequestService({
            wasteType: wasteType as string,
            driverId: driverId as string,
          });

        res.status(200).json({
          success: true,
          data: pickups,
        });
      } catch (error) {
        console.error('Error fetching pickups:', error);
        res.status(500).json({ message: 'Server error' });
      }
}
async getPickupRequestById (req: ProfileDriverRequest, res: Response): Promise<void> {
  try {
      const { pickupReqId } = req.params;
      const driverId = req.driver?.driverId;

      if (!pickupReqId || !driverId) {
        res.status(400).json({ success: false, message: "Missing pickupReqId or driverId" });
        return;
      }
      const pickup = await PickupService.getPickupByIdForDriver(pickupReqId, driverId);
      if (!pickup) {
        res.status(404).json({ success: false, message: "Pickup not found or not assigned to this driver" });
        return;
      }
      console.log("pickup",pickup);
      
      res.status(200).json({ success: true, data: pickup });
    } catch (error) {
      console.error('Error fetching pickups:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
}
}
export default new PickupController();