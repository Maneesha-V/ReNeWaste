import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/user/interface/INotificationService";
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";
@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.UserNotificationService)
    private notificationService: INotificationService
  ) {}
  async fetchNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(404).json({ message: "userId not found" });
        return;
      }
      const notifications = await this.notificationService.getNotifications(
        userId
      );
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  }
  async markReadNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { notifId } = req.params;
      const updatedNotification =
        await this.notificationService.markNotificationAsRead(notifId);

      if (!updatedNotification) {
        res.status(404).json({ message: "Notification not found" });
        return;
      }

      res.status(200).json(updatedNotification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read." });
    }
  }
}
