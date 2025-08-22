import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotificationDocument } from "../../models/notification/interfaces/notificationInterface";
import { RenewNotificationPayload } from "../../types/superAdmin/notificationTypes";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}
 async getNotifications(adminId: string) {
    return await this.notificationRepository.findByReceiverId(adminId);
  }
  async markNotificationAsRead(
    notifId: string,
    adminId: string
  ): Promise<INotificationDocument | null> {
    const notification = await this.notificationRepository.markAsReadById(
      notifId
    );
    if (!notification) {
      throw new Error("Notification not found.");
    }
    return notification;
  }
  // async remindRenewNotification(data: RenewNotificationPayload){
  //   const {plantId, adminId, daysLeft} = data;
  //   const message = `Reminder: Your plant subscription is expired within ${daysLeft} days. Please recharge to continue.`;

  //   const plantNotification =
  //     await this.notificationRepository.createNotification({
  //       receiverId: plantId,
  //       receiverType: "wasteplant",
  //       senderId: adminId,
  //       senderType: "superadmin",
  //       message,
  //       type: "renew_reminder",
  //     });
  //   console.log("notification", plantNotification);

  //   const io = global.io;

  //   if (io) {
  //     io.to(`${plantId}`).emit("newNotification", plantNotification);
  //   }
  //   return plantNotification;
  // }
  // async remindRechargeNotification(plantId: string, adminId: string){
  //    const message = `Reminder: Your plant subscription plan is expired. Please recharge to continue.`;

  //   const plantNotification =
  //     await this.notificationRepository.createNotification({
  //       receiverId: plantId,
  //       receiverType: "wasteplant",
  //       senderId: adminId,
  //       senderType: "superadmin",
  //       message,
  //       type: "recharge_reminder",
  //     });
  //   console.log("notification", plantNotification);

  //   const io = global.io;

  //   if (io) {
  //     io.to(`${plantId}`).emit("newNotification", plantNotification);
  //   }
  //   return plantNotification;
  // }
}