import { inject, injectable } from "inversify";
import { AttendanceModel } from "../../models/attendance/attendanceModel";
import { IAttendanceDocument } from "../../models/attendance/interfaces/attendanceInterface";
import BaseRepository from "../baseRepository/baseRepository";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import TYPES from "../../config/inversify/types";
import { IAttendanceRepository } from "./interface/IAttendanceRepository";
import {
  CreateAttendanceReq,
  DriverEarnRewardStatResp,
  FetchDriverEarnStats,
  FindDriverAttendanceReq,
} from "../../dtos/attendance/attendanceDTO";

@injectable()
export class AttendanceRepository
  extends BaseRepository<IAttendanceDocument>
  implements IAttendanceRepository
{
  constructor(
    @inject(TYPES.DriverRepository)
    private _driverRepository: IDriverRepository
  ) {
    super(AttendanceModel);
  }
  async createAttendance(data: CreateAttendanceReq) {
    return await this.model.create({
      driverId: data.driverId,
      wasteplantId: data.wasteplantId,
      assignedTruckId: data.assignedTruckId,
      status: data.status,
      date: new Date(),
    });
  }
  async findDriverAttendance(data: FindDriverAttendanceReq) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await this.model.findOne({
      driverId: data.driverId,
      wasteplantId: data.plantId,
      assignedTruckId: data.truckId,
      status: "present",
      date: { $gte: startOfToday, $lte: endOfToday },
    });
  }
  async getDriverEarnRewardStats(data: FetchDriverEarnStats): Promise<DriverEarnRewardStatResp[]> {
    const { driverId, filter } = data;
    const matchStage = {
      driverId,
      status: "present",
    };
    let groupStage = {};
    let dateFormat = "";
    if (filter === "daily") {
      groupStage = {
        _id: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
        totalReward: { $sum: "$reward" },
        totalEarning: { $sum: "$earning" },
      };
    } else if (filter === "monthly") {
      groupStage = {
        _id: {
          month: { $dateToString: { format: "%b %Y", date: "$date" } },
        },
        totalReward: { $sum: "$reward" },
        totalEarning: { $sum: "$earning" },
      };
    } else if (filter === "yearly") {
      groupStage = {
        _id: {
          year: { $dateToString: { format: "%Y", date: "$date" } },
        },
        totalReward: { $sum: "$reward" },
        totalEarning: { $sum: "$earning" },
      };
    }
    return await this.model.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: -1 } },
    ]);
  }
}
