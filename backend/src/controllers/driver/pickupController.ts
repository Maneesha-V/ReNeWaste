import { Response } from "express";
import { IPickupController } from "./interface/IPIckupController";
import PickupService from "../../services/driver/pickupService";
import { AuthRequest } from "../../types/common/middTypes";

class PickupController implements IPickupController {

async getPickupRequests (req: AuthRequest, res: Response): Promise<void> {
    try {
        const { wasteType } = req.query;
        const driverId = req.user?.id;
        const pickups = await PickupService.getPickupRequestService({
            wasteType: wasteType as string,
            driverId: driverId as string,
          });
          console.log("pick-driver",pickups);
          
        res.status(200).json({
          success: true,
          data: pickups,
        });
      } catch (error) {
        console.error('Error fetching pickups:', error);
        res.status(500).json({ message: 'Server error' });
      }
}
async getPickupRequestById (req: AuthRequest, res: Response): Promise<void> {
  try {
      const { pickupReqId } = req.params;
      const driverId = req.user?.id;

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
async updateAddressLatLng (req: AuthRequest, res: Response): Promise<void> {
  try {
    const { addressId } = req.params;
    const { latitude, longitude } = req.body;
    console.log("body",req.body);
    
    if (!latitude || !longitude) {
      res.status(400).json({ message: "Latitude and longitude are required" });
      return;
    }
    const updatedAddress = await PickupService.updateAddressLatLngService(addressId, latitude, longitude);

    res.status(200).json({ success: true, data: updatedAddress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || "Failed to update address location" });
  }
}
async updateTrackingStatus(req: AuthRequest, res: Response): Promise<void> {
  try {
    console.log(req.params);
      console.log(req.body);
    const { pickupReqId } = req.params;
    const { trackingStatus } = req.body;

    if (!trackingStatus) {
      res.status(400).json({ error: "trackingStatus is required" });
      return;
    }

    const updatedPickup = await PickupService.updateTrackingStatus(pickupReqId, trackingStatus);

    res.status(200).json({ success: true, data: updatedPickup });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update tracking status" });
  }
}

async markPickupCompleted(req: AuthRequest, res: Response): Promise<void> {
  try {
    console.log(req.params);
    const { pickupReqId } = req.params;

    if (!pickupReqId) {
      res.status(400).json({ error: "pickupReqId is required" });
      return;
    }

    const updatedPickup = await PickupService.markPickupCompletedService(pickupReqId);

    res.status(200).json({ success: true, data: updatedPickup });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || "Failed to update pickup completed" });
  }
}
}
export default new PickupController();