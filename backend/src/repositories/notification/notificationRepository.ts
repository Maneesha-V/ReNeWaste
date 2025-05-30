import { injectable } from "inversify";
import { INotificationDocument } from "../../models/notification/interfaces/notificationInterface";
import { NotificationModel } from "../../models/notification/notificationModel";
import BaseRepository from "../baseRepository/baseRepository";
import { INotificationRepository } from "./interface/INotifcationRepository";

@injectable()
export class NotificationRepository extends BaseRepository<INotificationDocument>  implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  } 
  
}