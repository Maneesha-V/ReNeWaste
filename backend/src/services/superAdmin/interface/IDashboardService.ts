import { IWastePlant } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface IDashboardService {
    fetchDashboardData(): Promise<IWastePlant[]>
}