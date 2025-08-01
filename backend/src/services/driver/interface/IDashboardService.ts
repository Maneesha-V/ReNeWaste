import { DriverDashboardResponse, DriverSupportInfo } from "../../../dtos/driver/driverDTO";

export interface IDashboardService {
    fetchDriverDashboard(driverId: string): Promise<DriverDashboardResponse>;
    fetchWastePlantSupport(driverId: string): Promise<DriverSupportInfo>;
}