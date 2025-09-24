import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";
import { INotificationDocument } from "../../models/notification/interfaces/notificationInterface";
import { NotificationMapper } from "../../mappers/NotificationMapper";
import { NotificationDTO } from "../../dtos/notification/notificationDTO";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}
  async getNotifications(adminId: string) {
    const notifications =
      await this.notificationRepository.findByReceiverId(adminId);
    if (!notifications) {
      throw new Error("Notification not found.");
    }
    return NotificationMapper.mapNotificationsDTO(notifications);
  }
  async markNotificationAsRead(notifId: string): Promise<NotificationDTO> {
    const notification =
      await this.notificationRepository.markAsReadById(notifId);
    if (!notification) {
      throw new Error("Notification not found.");
    }
    return NotificationMapper.mapNotificationDTO(notification);
  }
}
