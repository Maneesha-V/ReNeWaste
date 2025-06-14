import { IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";
import { FilterReport } from "../../../types/wastePlant/reportTypes";

export interface IReportService {
    getWasteReports(plantId: string): Promise<IPickupRequestDocument[]>;
    filterWasteReports(data: FilterReport): Promise<IPickupRequestDocument[]>;
}