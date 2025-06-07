import { InputWasteMeasurement, ReturnTotalWasteAmount, ReturnWasteMeasurement } from "../types/wasteCollectionTypes";

export interface IWasteCollectionRepository {
 createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
 totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount>;
}