import { NextFunction, Request, Response } from "express";
import { IPickupController } from "./interface/IPickupController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/wastePlant/interface/IPickupService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.PlantPickupService)
    private _pickupService: IPickupService,
  ) {}
  async getPickupRequests(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, wasteType } = req.query;
      const plantId = req.user?.id;

      const pickups = await this._pickupService.getPickupRequestService({
        status: status as string,
        wasteType: wasteType as string,
        plantId: plantId as string,
      });
       console.log("pickups", pickups);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        pickups,
      });
    } catch (error) {
      console.error("Error fetching pickups:", error);
      next(error);
    }
  }

  async approvePickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { status, driverId, assignedTruckId } = req.body;
      const { pickupReqId } = req.params;
      const plantId = req.user?.id;

      if (!plantId || !status || !driverId || !assignedTruckId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS,
        );
      }

      const result = await this._pickupService.approvePickupService({
        plantId,
        pickupReqId,
        status,
        driverId,
        assignedTruckId,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.PICKUP_APPROVE,
        result,
      });
    } catch (error) {
      console.error("Error approving pickup:", error);
      next(error);
    }
  }
  async cancelPickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const { reason } = req.body;
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const result = await this._pickupService.cancelPickupRequest(
        plantId,
        pickupReqId,
        reason,
      );

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.COMMON.SUCCESS.PICKUP_CANCEL,
        result,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  async reschedulePickup(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const { pickupReqId } = req.params;
      const rescheduleData = req.body;

      const updatedPickup = await this._pickupService.reschedulePickup(
        wasteplantId,
        pickupReqId,
        rescheduleData,
      );
      console.log("updatedPickup", updatedPickup);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.COMMON.SUCCESS.PICKUP_RESCHEDULE,
        updatedPickup,
      });
    } catch (error) {
      console.error("Error rescheduling pickup:", error);
      next(error);
    }
  }
  async fetchDriversByPlace(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const location = req.query.location as string;
      const plantId = req.user?.id;
      console.log({ location, plantId });
      if (!location) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.LOCATION_REQUIRED,
        );
      }
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const drivers = await this._pickupService.getAvailableDriverService(
        location,
        plantId,
      );
      console.log("drivers", drivers);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        drivers,
      });
    } catch (error) {
      console.error("Error fetching pickups:", error);
      next(error);
    }
  }
}
