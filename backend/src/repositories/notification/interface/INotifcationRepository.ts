import { INotification, INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";
import { CreateNotificationDTO, NotificationByReceiverId } from "../types/notificationTypes";

export interface INotificationRepository {
  createNotification(data: CreateNotificationDTO): Promise<INotificationDocument>;
  findByReceiverId(data: NotificationByReceiverId): Promise<INotificationDocument[]>;
  markAsReadById(notifId: string): Promise<INotificationDocument | null>;
  getNotificationById(notifId: string): Promise<INotificationDocument | null>
}