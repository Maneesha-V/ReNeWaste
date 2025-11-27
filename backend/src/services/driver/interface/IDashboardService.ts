import { AttendanceDTO, DriverEarnRewardStatResp, FetchDriverEarnStats } from "../../../dtos/attendance/attendanceDTO";
import {
  DriverDashboardResponse,
  DriverSupportInfo,
} from "../../../dtos/driver/driverDTO";

export interface IDashboardService {
  fetchDriverDashboard(driverId: string): Promise<DriverDashboardResponse>;
  fetchWastePlantSupport(driverId: string): Promise<DriverSupportInfo>;
  markAttendance(driverId: string, status: string): Promise<AttendanceDTO>;
  fetchDriverEarnStats( data: FetchDriverEarnStats): Promise<DriverEarnRewardStatResp[]>;
}
