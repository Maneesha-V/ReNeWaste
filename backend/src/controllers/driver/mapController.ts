import { Request, Response } from "express";
import { IMapController } from "./interface/IMapController";
import MapService from "../../services/driver/mapService";
import { AuthRequest } from "../../types/common/middTypes";

class MapController implements IMapController {
    async getETA(req: AuthRequest, res: Response): Promise<void> {
        const { origin, destination, pickupReqId, addressId } = req.query;
        console.log("query",req.query);
        
        if (!origin || !destination || !pickupReqId || !addressId) {
          res.status(400).json({ message: "Origin, destination,addressId and pickupId are required." });
          return;
        }
        try {
          const eta = await MapService.getAndSaveETA(origin as string, destination as string, pickupReqId as string, addressId as string);
          res.status(200).json({ eta });
        } catch (error) {
          console.error("Google Maps ETA error:", error);
          res.status(500).json({ message: "Failed to fetch ETA" });
        }
      }
}
export default new MapController();