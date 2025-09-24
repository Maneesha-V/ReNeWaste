import { NotificationDTO } from "../../../dtos/notification/notificationDTO";

export interface INotificationService {
  getNotifications(adminId: string): Promise<NotificationDTO[]>;
  markNotificationAsRead(notifId: string): Promise<NotificationDTO>;
}
