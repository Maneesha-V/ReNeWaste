import { INotificationDocument } from "../../../models/notification/interfaces/notificationInterface";
import { InputWasteMeasurement, ReturnWasteMeasurement } from "../../../repositories/wasteCollection/types/wasteCollectionTypes";

export interface INotificationService {
    getNotifications(wasteplantId: string) : Promise<INotificationDocument[]>;
    markNotificationAsRead(notifId: string, plantId: string): Promise<INotificationDocument | null>;
    saveWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
}