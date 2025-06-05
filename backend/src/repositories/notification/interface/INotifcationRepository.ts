import { INotification, INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";
import { CreateNotificationDTO } from "../types/notificationTypes";

export interface INotificationRepository {
  createNotification(data: CreateNotificationDTO): Promise<INotificationDocument>;
  findByReceiverId(id: string): Promise<INotificationDocument[]>;
  markAsReadById(notifId: string): Promise<INotificationDocument | null>;
  getNotificationById(notifId: string): Promise<INotificationDocument | null>
}