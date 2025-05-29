import { WastePlantDashboardStats } from "../../../types/wastePlant/dashboardTpes";

export interface IDashboardService {
 fetchWastePlantDashboard(plantId: string): Promise<WastePlantDashboardStats>
}