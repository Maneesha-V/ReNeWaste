import { Response } from "express";
import { ITruckController } from "./interface/ITruckController";
import TruckService from "../../services/driver/truckService";
import { AuthRequest } from "../../types/common/middTypes";

class TruckController implements ITruckController {
  
async fetchTruckForDriver (req: AuthRequest, res: Response): Promise<void> {
    try {
        const { driverId } = req.params;
    
        const assignedTruck = await TruckService.getTruckForDriver(driverId);
        console.log("assignedTruck",assignedTruck);
        
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
async requestTruckForDriver (req: AuthRequest, res: Response): Promise<void> {
  try {  
    const driverId = req.user?.id;

    if (!driverId) {
      res.status(400).json({ success: false, message: "Missing required field" });
      return;
    }
    const requestedDriver = await TruckService.requestTruck(driverId);

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
}
export default new TruckController();