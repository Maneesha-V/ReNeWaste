import { NotificationDTO } from "../../../dtos/notification/notificationDTO";


export interface INotificationService {
        getNotifications(driverId: string) : Promise<NotificationDTO[]>;
        markNotificationAsRead(notifId: string): Promise<NotificationDTO>;
}