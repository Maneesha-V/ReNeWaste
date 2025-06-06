import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { InputWasteMeasurement } from "../../types/wastePlant/notificationTypes";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository
  ) {}
 
  async getNotifications(wasteplantId: string) {
    return await this.notificationRepository.findByReceiverId(wasteplantId);
  }
  async markNotificationAsRead(notifId: string) {
    return this.notificationRepository.markAsReadById(notifId);
  }
  async saveWasteMeasurement(data: InputWasteMeasurement) {
  return await this.wasteCollectionRepository.createWasteMeasurement(data);
}
}