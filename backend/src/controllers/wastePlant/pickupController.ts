import { Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/wastePlant/interface/IPickupService";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.PlantPickupService)
    private pickupService: IPickupService
  ) {}
  async getPickupRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, wasteType } = req.query;
      const plantId = req.user?.id;

      const pickups = await this.pickupService.getPickupRequestService({
        status: status as string,
        wasteType: wasteType as string,
        plantId: plantId as string,
      });

      res.status(200).json({
        success: true,
        data: pickups,
      });
    } catch (error) {
      console.error("Error fetching pickups:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async approvePickup(req: Request, res: Response): Promise<void> {
    try {
      const { status, driverId, assignedTruckId } = req.body;
      const { pickupReqId } = req.params;

      if (!status || !driverId || !assignedTruckId) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      const result = await this.pickupService.approvePickupService({
        pickupReqId,
        status,
        driverId,
        // assignedZone,
        assignedTruckId,
      });

      res
        .status(200)
        .json({ message: "Pickup approved successfully", data: result });
    } catch (error) {
      console.error("Error approving pickup:", error);
      res.status(500).json({ message: "Server error while approving pickup" });
    }
  }
  async cancelPickup(req: Request, res: Response): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const { status } = req.body;

      const result = await this.pickupService.cancelPickupRequest(
        pickupReqId,
        status
      );

      res.status(200).json({
        message: "Pickup request canceled successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to cancel pickup request" });
    }
  }
  async reschedulePickup(req: Request, res: Response): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const rescheduleData = req.body;

      const updatedPickup = await this.pickupService.reschedulePickup(
        pickupReqId,
        rescheduleData
      );
      console.log("updatedPickup",updatedPickup);
      
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
  async fetchDriversByPlace(req: AuthRequest, res: Response): Promise<void> {
    try {
      const location = req.query.location as string;
      const plantId = req.user?.id;
      console.log({ location, plantId });
      if (!location) {
        res.status(400).json({ message: "Location is required" });
        return;
      }
      if (!plantId) {
        res.status(400).json({ message: "plantId is required" });
        return;
      }
      const drivers = await this.pickupService.getAvailableDriverService(
        location,
        plantId
      );
      console.log("drivers", drivers);

      res.status(200).json({
        success: true,
        data: drivers,
      });
    } catch (error) {
      console.error("Error fetching pickups:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
