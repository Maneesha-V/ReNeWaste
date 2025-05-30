import { Response } from "express";
import { ITruckController } from "./interface/ITruckController";
import { AuthRequest } from "../../types/common/middTypes";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckService } from "../../services/driver/interface/ITruckService";

@injectable()
export class TruckController implements ITruckController {
  constructor(
    @inject(TYPES.DriverTruckService)
    private truckService: ITruckService
  ) {}
  async fetchTruckForDriver(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user?.id;

      if (!driverId) {
        res.status(400).json({ success: false, message: "Required driverId" });
        return;
      }
      const { wasteplantId } = req.params;

      const assignedTruck = await this.truckService.getTruckForDriver(
        driverId,
        wasteplantId
      );
      console.log("assignedTruck", assignedTruck);

      res.status(200).json({
        success: true,
        message: "Fetch assigned truck successfully",
        data: assignedTruck,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch assigned truck",
        error: error.message,
      });
    }
  }
  async requestTruckForDriver(req: AuthRequest, res: Response): Promise<void> {
    try {
      const driverId = req.user?.id;

      if (!driverId) {
        res.status(400).json({ success: false, message: "Required driverId" });
        return;
      }
      const requestedDriver = await this.truckService.requestTruck(driverId);

      res.status(200).json({
        success: true,
        message: "Truck request sent successfully",
        data: requestedDriver,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to send request truck",
        error: error.message,
      });
    }
  }
  async markTruckReturn(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { truckId, plantId } = req.body;
      const driverId = req.user?.id;

      if (!truckId || !plantId || !driverId) {
        res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
        return;
      }

      await this.truckService.markTruckReturnService({
        truckId,
        plantId,
        driverId,
      });

      res.status(200).json({
        success: true,
        message: "Truck marked as returned",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to mark return truck.",
        error: error.message,
      });
    }
  }
}
