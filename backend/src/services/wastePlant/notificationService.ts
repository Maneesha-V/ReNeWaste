import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}
 
  async getNotifications(wasteplantId: string) {
    return await this.notificationRepository.findByReceiverId({ wasteplantId });
  }
  async markNotificationAsRead(notifId: string) {
    return this.notificationRepository.markAsReadById(notifId);
  }
}