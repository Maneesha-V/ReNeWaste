import { CreateNotificationDTO } from "../../../dtos/notification/notificationDTO";
import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";

export interface INotificationRepository {
  createNotification(
    data: CreateNotificationDTO,
  ): Promise<INotificationDocument>;
  findByReceiverId(id: string): Promise<INotificationDocument[]>;
  markAsReadById(notifId: string): Promise<INotificationDocument | null>;
  getNotificationById(notifId: string): Promise<INotificationDocument | null>;
}
