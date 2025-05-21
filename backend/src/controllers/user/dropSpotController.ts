import { Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotController } from "./interface/IDropSpotController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDropSpotService } from "../../services/user/interface/IDropSpotservice";

injectable()
export class DropSpotController implements IDropSpotController {
  constructor(
    @inject(TYPES.UserDropSpotService)
    private dropSpotService: IDropSpotService
  ){}
    async fetchAllNearDropSpots (req: AuthRequest,res: Response): Promise<void> {
      try {
        const userId = req.user?.id;
         if (!userId) {
          res.status(404).json({ message: "userId not found" });
          return;
        }
        const dropspots = await this.dropSpotService.getAllNearDropSpots(userId)   
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
