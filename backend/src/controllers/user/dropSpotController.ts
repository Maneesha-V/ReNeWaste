import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotController } from "./interface/IDropSpotController";
import DropSpotService from "../../services/user/dropSpotService";

class DropSpotController implements IDropSpotController {
    async fetchAllNearDropSpots (req: AuthRequest,res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
         if (!userId) {
          res.status(404).json({ message: "userId not found" });
          return;
        }
        const dropspots = await DropSpotService.getAllNearDropSpots(userId)   
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