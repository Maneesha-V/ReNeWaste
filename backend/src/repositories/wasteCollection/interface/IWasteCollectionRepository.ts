import { FilterReportRepo, InputWasteMeasurementRepo, IWasteCollectionDocument, ReturnTotalWasteAmount, ReturnWasteMeasurementRepo } from "../../../models/wasteCollection/interfaces/wasteCollectionInterface";

export interface IWasteCollectionRepository {
  createWasteMeasurement(
    data: InputWasteMeasurementRepo,
  ): Promise<ReturnWasteMeasurementRepo>;
  totalWasteAmount(plantId: string): Promise<ReturnTotalWasteAmount>;
  fetchWasteCollectionReportsByPlantId(
    plantId: string,
  ): Promise<IWasteCollectionDocument[]>;
  filterWasteCollectionReportsByPlantId(
    data: FilterReportRepo,
  ): Promise<IWasteCollectionDocument[]>;
  getTotalWasteCollected(): Promise<number>;
}
