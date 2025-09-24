import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/superAdmin/interface/INotificationService";
import { NextFunction, Response } from "express";
import { AuthRequest } from "../../dtos/base/BaseDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.SuperAdminNotificationService)
    private notificationService: INotificationService
  ) {}
  async fetchNotifications(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
      const notifications = await this.notificationService.getNotifications(
        adminId
      );

      res.status(STATUS_CODES.SUCCESS).json({ notifications: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      next(error);
    }
  }
  async markReadNotification(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { notifId } = req.params;
      const adminId = req.user?.id;
      if (!adminId) {
        throw new ApiError(
          STATUS_CODES.UNAUTHORIZED,
          MESSAGES.COMMON.ERROR.UNAUTHORIZED
        );
      }
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
