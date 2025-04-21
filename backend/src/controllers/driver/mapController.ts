import { Request, Response } from "express";
import { ProfileDriverRequest } from "../../types/driver/authTypes";
import { IMapController } from "./interface/IMapController";
import MapService from "../../services/driver/mapService";

class MapController implements IMapController {
    async getETA(req: ProfileDriverRequest, res: Response): Promise<void> {
        const { origin, destination, pickupReqId } = req.query;
        console.log("query",req.query);
        
        if (!origin || !destination || !pickupReqId) {
          res.status(400).json({ message: "Origin, destination, and pickupId are required." });
          return;
        }
        try {
          const eta = await MapService.getAndSaveETA(origin as string, destination as string, pickupReqId as string);
          res.status(200).json({ eta });
        } catch (error) {
          console.error("Google Maps ETA error:", error);
          res.status(500).json({ message: "Failed to fetch ETA" });
        }
      }
}
export default new MapController();