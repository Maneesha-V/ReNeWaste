import { IWasteCollectionDocument } from "../../../models/wasteCollection/interfaces/wasteCollectionInterface";
import { FilterReport } from "../../../types/wastePlant/reportTypes";
import { InputWasteMeasurement, ReturnTotalWasteAmount, ReturnWasteMeasurement } from "../types/wasteCollectionTypes";

export interface IWasteCollectionRepository {
 createWasteMeasurement(data: InputWasteMeasurement): Promise<ReturnWasteMeasurement>;
 totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount>;
 fetchWasteCollectionReportsByPlantId(plantId: string): Promise<IWasteCollectionDocument[]>;
 filterWasteCollectionReportsByPlantId(data: FilterReport): Promise<IWasteCollectionDocument[]>;
}