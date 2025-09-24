import { DashboardDataResp } from "../../../dtos/common/commonDTO";

export interface IDashboardService {
  getDashboardData(plantId: string): Promise<DashboardDataResp>;
}
