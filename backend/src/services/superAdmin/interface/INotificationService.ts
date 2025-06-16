import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";
import { RenewNotificationPayload } from "../../../types/superAdmin/notificationTypes";

export interface INotificationService {
  getNotifications(adminId: string): Promise<INotificationDocument[]>;
  markNotificationAsRead(
    adminId: string,
    notifId: string
  ): Promise<INotificationDocument | null>;
  remindRenewNotification(data: RenewNotificationPayload): Promise<INotificationDocument>;
  remindRechargeNotification(plantId: string, adminId: string): Promise<INotificationDocument>;
}
