import { NextFunction, Response } from "express";
import { ITruckController } from "./interface/ITruckController";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ITruckService } from "../../services/driver/interface/ITruckService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class TruckController implements ITruckController {
  constructor(
    @inject(TYPES.DriverTruckService)
    private truckService: ITruckService,
  ) {}
  async fetchTruckForDriver(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user?.id;

      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const { wasteplantId } = req.params;

      const assignedTruck = await this.truckService.getTruckForDriver(
        driverId,
        wasteplantId,
      );
      console.log("assignedTruck", assignedTruck);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DRIVER.SUCCESS.FETCH_ASSIGN_TRUCK,
        assignedTruck,
      });
    } catch (error) {
      next(error);
    }
  }
  async requestTruckForDriver(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const driverId = req.user?.id;

      if (!driverId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const requestedDriver = await this.truckService.requestTruck(driverId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DRIVER.SUCCESS.TRUCK_REQ_SENT,
        requestedDriver,
      });
    } catch (error) {
      next(error);
    }
  }
  async markTruckReturn(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { truckId, plantId } = req.body;
      const driverId = req.user?.id;

      if (!truckId || !plantId || !driverId) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS,
        );
      }

      const updated = await this.truckService.markTruckReturnService({
        truckId,
        plantId,
        driverId,
      });
      if (updated) {
        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.DRIVER.SUCCESS.MARK_RETURN_TRUCK,
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
