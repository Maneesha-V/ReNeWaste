import { injectable } from "inversify";
import { INotificationDocument } from "../../models/notification/interfaces/notificationInterface";
import { NotificationModel } from "../../models/notification/notificationModel";
import BaseRepository from "../baseRepository/baseRepository";
import { INotificationRepository } from "./interface/INotifcationRepository";
import { CreateNotificationDTO, NotificationByReceiverId } from "./types/notificationTypes";

@injectable()
export class NotificationRepository extends BaseRepository<INotificationDocument>  implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  } 
  async createNotification(data: CreateNotificationDTO): Promise<INotificationDocument> {
    const notification = new this.model({
      receiverId: data.receiverId,
      receiverType: data.receiverType,
      message: data.message,
      type: data.type
    });
    return await notification.save();
  }
  async findByReceiverId(data: NotificationByReceiverId): Promise<INotificationDocument[]> {
    const res = await this.model.find({ receiverId: data.wasteplantId }).sort({ createdAt: -1 });
    return res;
  }
  
  async markAsReadById(notifId: string) {
  return this.model.findByIdAndUpdate(
    notifId,
    { isRead: true },
    { new: true } 
  );
}
async getNotificationById(notifId: string): Promise<INotificationDocument | null> {
  return await this.model.findById(notifId);
}
}