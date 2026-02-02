import { ClientSession } from "mongoose";
import { AttendancePieItemDTO, CreateAttendanceReq, DriverEarnRewardStatResp, FetchDriverEarnStats, FindDriverAttendanceReq } from "../../../dtos/attendance/attendanceDTO";
import { IAttendanceDocument } from "../../../models/attendance/interfaces/attendanceInterface";

export interface IAttendanceRepository {
    createAttendance(data: CreateAttendanceReq): Promise<IAttendanceDocument>;
    findDriverAttendance(data: FindDriverAttendanceReq, session?: ClientSession): Promise<IAttendanceDocument | null>;
    getDriverEarnRewardStats(data: FetchDriverEarnStats): Promise<DriverEarnRewardStatResp[]>;
    findAttendancesByDriverId(driverId: string): Promise<AttendancePieItemDTO[]>;
}