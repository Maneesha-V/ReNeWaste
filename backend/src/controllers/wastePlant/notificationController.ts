import { Response } from "express";
import { inject, injectable } from "inversify";
import { AuthRequest } from "../../types/common/middTypes";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/wastePlant/interface/INotificationService";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.PlantNotificationService)
    private notificationService: INotificationService
  ) {}

  async fetchNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }
      const notifications = await this.notificationService.getNotifications(
        wasteplantId
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
  async saveWasteMeasurement(req: AuthRequest, res: Response): Promise<void> {
        try {
          console.log("body",req.body);
          
      const wasteplantId = req.user?.id;
      if (!wasteplantId) {
        res.status(404).json({ message: "wasteplantId not found" });
        return;
      }

    const { notificationId, weight } = req.body;

    if (!notificationId || !weight) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const result = await this.notificationService.saveWasteMeasurement({
      wasteplantId,
      weight,
      notificationId
    });

    res.status(200).json({ message: "Waste measurement saved", data: result });
    } catch (error) {
      console.error("Error in waste measurement:", error);
      res.status(500).json({ error: "Error in waste measurement" });
    }
  }
}
