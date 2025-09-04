import { WasteCollectionDTO } from "../../../dtos/wasteCollection/wasteCollectionDTO";
import { FilterReport } from "../../../dtos/wasteplant/WasteplantDTO";


export interface IReportService {
    getWasteReports(plantId: string): Promise<WasteCollectionDTO[]>;
    filterWasteReports(data: FilterReport): Promise<WasteCollectionDTO[]>;
}