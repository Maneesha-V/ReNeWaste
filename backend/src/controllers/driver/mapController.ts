import { NextFunction, Request, Response } from "express";
import { IMapController } from "./interface/IMapController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IMapService } from "../../services/driver/interface/IMapService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class MapController implements IMapController {
  constructor(
    @inject(TYPES.DriverMapService)
    private mapService: IMapService
  ){}
    async getETA(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
              try {
        const { origin, destination, pickupReqId, addressId } = req.query;
        console.log("query",req.query);
        
        if (!origin || !destination || !pickupReqId || !addressId) {
          throw new ApiError(
                          STATUS_CODES.NOT_FOUND,
                          MESSAGES.COMMON.ERROR.MISSING_FIELDS
                        );
        }

          const eta = await this.mapService.getAndSaveETA(origin as string, destination as string, pickupReqId as string, addressId as string);
          res.status(STATUS_CODES.SUCCESS).json({ eta });
        } catch (error) {
          console.error("Google Maps ETA error:", error);
          next(error);
        }
      }
}