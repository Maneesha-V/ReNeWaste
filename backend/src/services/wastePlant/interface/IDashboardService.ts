import { DashboardDataResp } from "../../../dtos/common/commonDTO";
import { FetchWPDashboard } from "../../../dtos/wasteplant/WasteplantDTO";

export interface IDashboardService {
  getDashboardData(data: FetchWPDashboard): Promise<DashboardDataResp>;
}
