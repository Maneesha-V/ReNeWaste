import { FilterReport } from "../../../dtos/wasteplant/WasteplantDTO";
import { IWasteCollectionDocument } from "../../../models/wasteCollection/interfaces/wasteCollectionInterface";
import { InputWasteMeasurement, ReturnTotalWasteAmount, ReturnWasteMeasurement } from "../types/wasteCollectionTypes";

export interface IWasteCollectionRepository {
 createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
 totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount>;
 fetchWasteCollectionReportsByPlantId(plantId: string): Promise<IWasteCollectionDocument[]>;
 filterWasteCollectionReportsByPlantId(data: FilterReport): Promise<IWasteCollectionDocument[]>;
 getTotalWasteCollected(): Promise<number>;
}