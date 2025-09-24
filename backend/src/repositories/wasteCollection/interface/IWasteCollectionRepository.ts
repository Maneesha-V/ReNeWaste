import { InputWasteMeasurement, ReturnTotalWasteAmount, ReturnWasteMeasurement } from "../../../dtos/wasteCollection/wasteCollectionDTO";
import { FilterReport } from "../../../dtos/wasteplant/WasteplantDTO";
import { IWasteCollectionDocument } from "../../../models/wasteCollection/interfaces/wasteCollectionInterface";

export interface IWasteCollectionRepository {
 createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
 totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount>;
 fetchWasteCollectionReportsByPlantId(plantId: string): Promise<IWasteCollectionDocument[]>;
 filterWasteCollectionReportsByPlantId(data: FilterReport): Promise<IWasteCollectionDocument[]>;
 getTotalWasteCollected(): Promise<number>;
}