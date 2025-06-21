import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { IWasteCollectionDocument } from "../../../models/wasteCollection/interfaces/wasteCollectionInterface";
import { FilterReport } from "../../../types/wastePlant/reportTypes";

export interface IReportService {
    getWasteReports(plantId: string): Promise<IWasteCollectionDocument[]>;
    filterWasteReports(data: FilterReport): Promise<IWasteCollectionDocument[]>;
}