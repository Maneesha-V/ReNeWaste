"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceMapper = void 0;
class AttendanceMapper {
    static mapAttendanceDTO(doc) {
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
            wpEarning: doc.wpEarning ?? 0,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
        };
    }
    static mapAttendancesDTO(docs) {
        return docs.map((doc) => this.mapAttendanceDTO(doc));
    }
}
exports.AttendanceMapper = AttendanceMapper;
