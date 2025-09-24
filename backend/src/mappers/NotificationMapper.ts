import { NotificationDTO } from "../dtos/notification/notificationDTO";
import { INotificationDocument } from "../models/notification/interfaces/notificationInterface";

export class NotificationMapper {
  static mapNotificationDTO(doc: INotificationDocument): NotificationDTO {
    return {
      _id: doc._id.toString(),
      receiverId: doc.receiverId.toString() ?? "",
      receiverType: doc.receiverType,
      senderId: doc.receiverId.toString() ?? "",
      senderType: doc.senderType,
      message: doc.message ?? "",
      type: doc.type,
      isRead: doc.isRead,
      createdAt: doc.createdAt,
    };
  }
  static mapNotificationsDTO(docs: INotificationDocument[]): NotificationDTO[] {
    return docs.map((doc) => this.mapNotificationDTO(doc));
  }
}
