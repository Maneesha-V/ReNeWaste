import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationService } from "./interface/INotificationService";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
  ) {}

}