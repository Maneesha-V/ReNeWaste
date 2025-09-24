import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationService } from "./interface/INotificationService";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { NotificationMapper } from "../../mappers/NotificationMapper";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}
  async getNotifications(driverId: string) {
    const notifications =
      await this.notificationRepository.findByReceiverId(driverId);
    if (!notifications) {
      throw new Error("Notification not found.");
    }
    return NotificationMapper.mapNotificationsDTO(notifications);
  }
  async markNotificationAsRead(notifId: string) {
    const notification =
      await this.notificationRepository.markAsReadById(notifId);
    if (!notification) {
      throw new Error("Notification not found.");
    }
    return NotificationMapper.mapNotificationDTO(notification);
  }
}
