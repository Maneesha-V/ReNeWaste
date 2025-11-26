import { model } from "mongoose";
import { IAttendanceDocument } from "./interfaces/attendanceInterface";
import { attendanceSchema } from "./attendanceSchema";

export const AttendanceModel = model<IAttendanceDocument>("Attendance", attendanceSchema);