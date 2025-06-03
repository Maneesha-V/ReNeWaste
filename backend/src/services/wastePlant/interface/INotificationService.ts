import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";

export interface INotificationService {
    getNotifications(wasteplantId: string) : Promise<INotificationDocument[]>;
    markNotificationAsRead(notifId: string): Promise<INotificationDocument | null>;
}