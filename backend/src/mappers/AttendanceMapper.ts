import { AttendanceDTO } from "../dtos/attendance/attendanceDTO";
import { IAttendanceDocument } from "../models/attendance/interfaces/attendanceInterface";

export class AttendanceMapper {
  static mapAttendanceDTO(doc: IAttendanceDocument): AttendanceDTO {
    return {
      _id: doc._id.toString(),
      driverId: doc.wasteplantId?.toString(),
      wasteplantId: doc.wasteplantId?.toString(),
      assignedTruckId: doc.assignedTruckId?.toString(),
      date: doc.date,
      status: doc.status,
      workType: doc.workType,
      totalPickups: doc.totalPickups ?? 0,
      reward: doc.reward ?? 0,
      earning: doc.earning ?? 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}