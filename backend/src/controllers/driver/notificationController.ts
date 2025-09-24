import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/driver/interface/INotificationService";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import { AuthRequest } from "../../dtos/base/BaseDTO";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.DriverNotificationService)
    private notificationService: INotificationService,
  ) {}
  async fetchNotifications(
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
      const notifications =
        await this.notificationService.getNotifications(driverId);
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
      const updatedNotification =
        await this.notificationService.markNotificationAsRead(notifId);

      res
        .status(STATUS_CODES.SUCCESS)
        .json({ updatedNotification: updatedNotification });
    } catch (error) {
      next(error);
    }
  }
}
