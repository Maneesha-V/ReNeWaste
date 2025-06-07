import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";

export interface INotificationService {
    getNotifications(userId: string) : Promise<INotificationDocument[]>;
    markNotificationAsRead(notifId: string): Promise<INotificationDocument | null>;
}