import { NextFunction, Response } from "express";
import { IPickupController } from "./interface/IPIckupController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupService } from "../../services/driver/interface/IPickupService";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { ApiError } from "../../utils/ApiError";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class PickupController implements IPickupController {
  constructor(
    @inject(TYPES.DriverPickupService)
    private pickupService: IPickupService,
  ) {}
  async getPickupRequests(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("query", req.query);
      // const { wasteType } = req.query;
      const driverId = req.user?.id;
      const pickups = await this.pickupService.getPickupRequestService({
        // wasteType: wasteType as string,
        driverId: driverId as string,
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
  async getPickupRequestById(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { pickupReqId } = req.params;
      const driverId = req.user?.id;

      if (!pickupReqId || !driverId) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.MISSING_IDS,
        );
      }
      const pickup = await this.pickupService.getPickupByIdForDriver(
        pickupReqId,
        driverId,
      );
      console.log("tr-pickup", pickup);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        pickup,
      });
    } catch (error) {
      console.error("Error fetching pickups:", error);
      next(error);
    }
  }
  async updateAddressLatLng(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { addressId } = req.params;
      const { latitude, longitude } = req.body;
      console.log("body", req.body);

      if (!latitude || !longitude) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.DRIVER.ERROR.LAT_LONG_REQUIRED,
        );
      }
      const updatedAddress =
        await this.pickupService.updateAddressLatLngService(
          addressId,
          latitude,
          longitude,
        );

      res.status(STATUS_CODES.SUCCESS).json({ success: true, updatedAddress });
    } catch (error) {
      next(error);
    }
  }
  async updateTrackingStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log(req.params);
      console.log(req.body);
      const { pickupReqId } = req.params;
      const { trackingStatus } = req.body;

      if (!trackingStatus) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.DRIVER.ERROR.STATUS_REQUIRED,
        );
      }

      const updatedPickup = await this.pickupService.updateTrackingStatus(
        pickupReqId,
        trackingStatus,
      );

      res.status(STATUS_CODES.SUCCESS).json({ success: true, updatedPickup });
    } catch (error) {
      next(error);
    }
  }

  async markPickupCompleted(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log(req.params);
      const { pickupReqId } = req.params;

      if (!pickupReqId) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.COMMON.ERROR.ID_REQUIRED,
        );
      }

      const pickupStatus =
        await this.pickupService.markPickupCompletedService(pickupReqId);
      if (pickupStatus) {
        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.DRIVER.SUCCESS.MARK_PICKUP_COMPLETED,
          pickupStatus,
        });
      } else {
        res.status(STATUS_CODES.FORBIDDEN).json({
          success: false,
          message: MESSAGES.DRIVER.ERROR.MARK_PICKUP_COMPLETED,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
