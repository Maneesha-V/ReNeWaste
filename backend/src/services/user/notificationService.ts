import { inject, injectable } from "inversify";
import { INotificationService } from "./interface/INotificationService";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { NotificationMapper } from "../../mappers/NotificationMapper";
import { NotificationDTO } from "../../dtos/notification/notificationDTO";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}
  async getNotifications(userId: string): Promise<NotificationDTO[]> {
    const notifications =
      await this.notificationRepository.findByReceiverId(userId);
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
