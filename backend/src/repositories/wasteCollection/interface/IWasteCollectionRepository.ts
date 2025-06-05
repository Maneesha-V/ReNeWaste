import { InputWasteMeasurement, ReturnWasteMeasurement } from "../../../types/wastePlant/notificationTypes";

export interface IWasteCollectionRepository {
 createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
}