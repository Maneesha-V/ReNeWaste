import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationController } from "./interface/INotificationController";
import { INotificationService } from "../../services/user/interface/INotificationService";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.UserNotificationService)
    private notificationService: INotificationService
  ) {}
}