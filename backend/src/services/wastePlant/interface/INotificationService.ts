import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";
import { InputWasteMeasurement, ReturnWasteMeasurement } from "../../../types/wastePlant/notificationTypes";

export interface INotificationService {
    getNotifications(wasteplantId: string) : Promise<INotificationDocument[]>;
    markNotificationAsRead(notifId: string): Promise<INotificationDocument | null>;
    saveWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
}