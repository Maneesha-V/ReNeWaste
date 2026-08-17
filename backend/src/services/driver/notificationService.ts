import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationService } from "./interface/INotificationService";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { NotificationMapper } from "../../mappers/NotificationMapper";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.NOTIFICATION_NOT_FOUND,
      );
    }
    return NotificationMapper.mapNotificationsDTO(notifications);
  }
  async markNotificationAsRead(notifId: string) {
    const notification =
      await this.notificationRepository.markAsReadById(notifId);
    if (!notification) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.NOTIFICATION_NOT_FOUND,
      );
    }
    return NotificationMapper.mapNotificationDTO(notification);
  }
}
