import { PopulatedWasteCollectionDTO, WasteCollectionDTO } from "../../../dtos/wasteCollection/wasteCollectionDTO";
import { FilterReport } from "../../../dtos/wasteplant/WasteplantDTO";

export interface IReportService {
  getWasteReports(plantId: string): Promise<PopulatedWasteCollectionDTO[]>;
  filterWasteReports(data: FilterReport): Promise<WasteCollectionDTO[]>;
}
