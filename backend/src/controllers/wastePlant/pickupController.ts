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

async approvePickup(req: ProfilePlantRequest, res: Response): Promise<void> {
  try {
    const { status, driverId, assignedZone } = req.body;
    const { pickupReqId } = req.params;

    if (!status || !driverId || !assignedZone) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const result = await PickupService.approvePickupService({
      pickupReqId,
      status,
      driverId,
      assignedZone,
    });

    res.status(200).json({ message: "Pickup approved successfully", data: result });
  } catch (error) {
    console.error("Error approving pickup:", error);
    res.status(500).json({ message: "Server error while approving pickup" });
  }
}
async cancelPickup(req: ProfilePlantRequest, res: Response): Promise<void> {
  try {
    const { pickupReqId } = req.params; 
    const { status } = req.body; 

    const result = await PickupService.cancelPickupRequest(pickupReqId, status);

      res.status(200).json({
      message: "Pickup request canceled successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel pickup request" });
  }
}
async reschedulePickup(req: ProfilePlantRequest, res: Response): Promise<void> {
  try {
    const { pickupReqId } = req.params;
    const rescheduleData = req.body;

    const updatedPickup = await PickupService.reschedulePickup(pickupReqId, rescheduleData);
    
    res.status(200).json({
      success: true,
      message: "Pickup rescheduled successfully",
      data: updatedPickup,
    });
  } catch (error: any) {
    console.error("Error rescheduling pickup:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
}
}
export default new PickupController();