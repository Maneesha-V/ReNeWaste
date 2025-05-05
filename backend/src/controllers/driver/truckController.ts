import { Response } from "express";
import { ITruckController } from "./interface/ITruckController";
import TruckService from "../../services/driver/truckService";
import { AuthRequest } from "../../types/common/middTypes";

class TruckController implements ITruckController {

async requestTruckForDriver (req: AuthRequest, res: Response): Promise<void> {
    try {
        const { driverId } = req.params;
    
        const assignedTruck = await TruckService.requestTruck(driverId);
        console.log("assignedTruck",assignedTruck);
        
        res.status(200).json({
          success: true,
          message: "Truck request sent successfully",
          data: assignedTruck,
        });
      } catch (error: any) {
        res.status(500).json({
          success: false,
          message: "Failed to request truck",
          error: error.message,
        });
      }
}
}
export default new TruckController();