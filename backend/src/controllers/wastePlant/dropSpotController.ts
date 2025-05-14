import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotController } from "./interface/IDropSpotController";
import DropSpotService from "../../services/wastePlant/dropSpotService";

class DropSpotController implements IDropSpotController {
    async createDropSpot(req: AuthRequest, res: Response): Promise<void>{
    try {
    console.log(req.body);
      const wasteplantId = req.user?.id;
      console.log(wasteplantId);
       if (!wasteplantId) {
        res.status(403).json({ success: false, error: "Unauthorized or invalid plant ID" });
        return;
      }

      const payloadWithPlant = {
        ...req.body,
        wasteplantId
      };
      const dropSpotData = req.body;
      const newDropSpot = await DropSpotService.createDropSpotService(payloadWithPlant);
      console.log("newDropSpot",newDropSpot);
      
      res.status(201).json({ success: true, data: newDropSpot });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Failed to create drop spot" });
    }
    }
    
    async fetchDropSpots (req: AuthRequest,res: Response): Promise<void> {
      try {
        const wasteplantId = req.user?.id;
         if (!wasteplantId) {
          res.status(404).json({ message: "wasteplantId not found" });
          return;
        }
        const dropspots = await DropSpotService.getAllDropSpots(wasteplantId)   
        console.log("dropspots",dropspots);
        
        res.status(200).json({
          success: true,
          message: "Fetch dropspots successfully",
          data: dropspots,
        });
      }catch (error:any){
        console.error("err",error);
        res.status(500).json({ message: "Error fetching dropspots.", error });
      }
    }
}
export default new DropSpotController();