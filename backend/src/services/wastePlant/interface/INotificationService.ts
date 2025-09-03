import { NotificationDTO } from "../../../dtos/notification/notificationDTO";
import { InputWasteMeasurement, ReturnWasteMeasurement } from "../../../repositories/wasteCollection/types/wasteCollectionTypes";

export interface INotificationService {
    getNotifications(wasteplantId: string) : Promise<NotificationDTO[]>;
    markNotificationAsRead(notifId: string, plantId: string): Promise<NotificationDTO>;
    saveWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
}