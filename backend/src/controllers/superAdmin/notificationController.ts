import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/superAdmin/interface/INotificationService";
import { AuthRequest } from "../../types/common/middTypes";
import { Response } from "express";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.SuperAdminNotificationService)
    private notificationService: INotificationService
  ) {}
    async fetchNotifications(req: AuthRequest, res: Response): Promise<void> {
      try {
        const adminId = req.user?.id;
        if (!adminId) {
          res.status(404).json({ message: "AdminId not found" });
          return;
        }
        const notifications = await this.notificationService.getNotifications(
          adminId
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
        const adminId = req.user?.id;
        if (!adminId) {
          res.status(404).json({ message: "AdminId not found" });
          return;
        }
        const updatedNotification =
          await this.notificationService.markNotificationAsRead(notifId, adminId);
  
        if (!updatedNotification) {
          res.status(404).json({ message: "Notification not found" });
          return;
        }
  
        res.status(200).json(updatedNotification);
      } catch (error) {
        res.status(500).json({ error: "Failed to mark notification as read." });
      }
    }
    // async remindRenewNotification (req: AuthRequest, res: Response): Promise<void> {
    //   try {
    //     const {plantId, daysLeft } = req.body;
    //     if (!plantId || !daysLeft) {
    //       res.status(404).json({ message: "daysLeft,plantId not found" });
    //       return;
    //     }
    //     const adminId = req.user?.id;
    //     if (!adminId) {
    //       res.status(404).json({ message: "AdminId not found" });
    //       return;
    //     }
    //     const remindNotification =
    //       await this.notificationService.remindRenewNotification({plantId, daysLeft, adminId});
  
    //     if (!remindNotification) {
    //       res.status(404).json({ message: "Notification not found" });
    //       return;
    //     }
  
    //     res.status(200).json(remindNotification);
    //   } catch (error) {
    //     res.status(500).json({ error: "Failed to remind notification." });
    //   }
    // }
    // async remindRechargeNotification (req: AuthRequest, res: Response): Promise<void> {
    //   try {
    //     const {plantId} = req.body;
    //     if (!plantId ) {
    //       res.status(404).json({ message: "plantId not found" });
    //       return;
    //     }
    //     const adminId = req.user?.id;
    //     if (!adminId) {
    //       res.status(404).json({ message: "AdminId not found" });
    //       return;
    //     }
    //     const rechargeNotification =
    //       await this.notificationService.remindRechargeNotification(plantId,adminId);
  
    //     if (!rechargeNotification) {
    //       res.status(404).json({ message: "Notification not found" });
    //       return;
    //     }
  
    //     res.status(200).json(rechargeNotification);
    //   } catch (error) {
    //     res.status(500).json({ error: "Failed to recharge notification." });
    //   }
    // }
}