import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/wastePlant/interface/INotificationService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.PlantNotificationService)
    private _notificationService: INotificationService,
  ) {}

  async fetchNotifications(
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
      const notifications =
        await this._notificationService.getNotifications(wasteplantId);
      res.status(STATUS_CODES.SUCCESS).json({ notifications: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      next(error);
    }
  }
  async markReadNotification(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { notifId } = req.params;
      const plantId = req.user?.id;
      if (!plantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }
      const updatedNotification =
        await this._notificationService.markNotificationAsRead(
          notifId,
          plantId,
        );

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ updatedNotification: updatedNotification });
    } catch (error) {
      next(error);
    }
  }
  async saveWasteMeasurement(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log("body", req.body);

      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED,
        );
      }

      const { notificationId, weight } = req.body;

      if (!notificationId || !weight) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.MISSING_FIELDS,
        );
      }

      const result = await this._notificationService.saveWasteMeasurement({
        wasteplantId,
        weight,
        notificationId,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        message: MESSAGES.WASTEPLANT.SUCCESS.WASTE_MWASURED,
        data: result,
      });
    } catch (error) {
      console.error("Error in waste measurement:", error);
      next(error);
    }
  }
}
