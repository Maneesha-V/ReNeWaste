import { SuperAdminDashboardData } from "../../../dtos/superadmin/superadminDTO";

export interface IDashboardService {
    fetchSuperAdminDashboard(adminId: string): Promise<SuperAdminDashboardData>
}