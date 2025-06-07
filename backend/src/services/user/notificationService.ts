import { inject, injectable } from "inversify";
import { INotificationService } from "./interface/INotificationService";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}
  async getNotifications(userId: string) {
    return await this.notificationRepository.findByReceiverId(userId);
  }
  async markNotificationAsRead(notifId: string) {
    return this.notificationRepository.markAsReadById(notifId);
  }
}
