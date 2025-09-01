import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/common/middTypes";
import { IDropSpotController } from "./interface/IDropSpotController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IDropSpotService } from "../../services/wastePlant/interface/IDropSpotService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class DropSpotController implements IDropSpotController {
  constructor(
    @inject(TYPES.PlantDropSpotService)
    private dropspotService: IDropSpotService
  ) {}
  async createDropSpot(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
       throw new ApiError(
                 STATUS_CODES.UNAUTHORIZED,
                 MESSAGES.COMMON.ERROR.UNAUTHORIZED
               );
      }

      const payloadWithPlant = {
        ...req.body,
        wasteplantId,
      };

      const success = await this.dropspotService.createDropSpotService(
        payloadWithPlant
      );
      
   if(success){
        res.status(STATUS_CODES.SUCCESS).json({ 
          success: true, 
          message: MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_CREATE 
        });
      } else {
        res.status(STATUS_CODES.SERVER_ERROR).json({ 
          success: false, 
          message: MESSAGES.WASTEPLANT.ERROR.DROP_SPOT_CREATE });
      }
    } catch (error) {
      next(error);
    }
  }

  async fetchDropSpots(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.query);

      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const search = (req.query.search as string) || "";
      const { dropspots, total } = await this.dropspotService.getAllDropSpots(
        wasteplantId,
        page,
        limit,
        search
      );
      console.log("dropspots", dropspots);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.WASTEPLANT.SUCCESS.FETCH_DROP_SPOT,
        dropspots,
        total,
      });
    } catch (error) {
      next(error);
    }
  }

  async fetchDropSpotById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
       throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const selectedDropSpot =
        await this.dropspotService.getDropSpotByIdService(
          dropSpotId,
          wasteplantId
        );

      console.log("selectedDropSpot", selectedDropSpot);

      res.status(STATUS_CODES.SUCCESS).json(selectedDropSpot);
    } catch (error) {
      console.error("Error fetching truck:", error);
      next(error);
    }
  }

  async deleteDropSpotById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
         throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const result = await this.dropspotService.deleteDropSpotByIdService(
        dropSpotId,
        wasteplantId
      );
      console.log("result-delete", result);

      res.status(STATUS_CODES.SUCCESS).json({ message: MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_DELETE });
    } catch (error) {
      console.error("Error in deleting dropspot:", error);
      next(error);
    }
  }

  async updateDropSpot(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { dropSpotId } = req.params;
      const wasteplantId = req.user?.id;

      if (!wasteplantId) {
          throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }

      const updateData = req.body;

      const updatedDropSpot = await this.dropspotService.updateDropSpotService(
        wasteplantId,
        dropSpotId,
        updateData
      );


      res.status(STATUS_CODES.SUCCESS).json({ 
        updatedDropSpot, 
        message: MESSAGES.WASTEPLANT.SUCCESS.DROP_SPOT_UPDATE
      });
    } catch (error) {
      console.error("Error updating dropspot:", error);
      next(error);
    }
  }
}
