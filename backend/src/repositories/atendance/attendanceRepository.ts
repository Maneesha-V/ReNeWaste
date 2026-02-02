import { inject, injectable } from "inversify";
import { AttendanceModel } from "../../models/attendance/attendanceModel";
import { IAttendanceDocument } from "../../models/attendance/interfaces/attendanceInterface";
import BaseRepository from "../baseRepository/baseRepository";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import TYPES from "../../config/inversify/types";
import { IAttendanceRepository } from "./interface/IAttendanceRepository";
import {
  AttendancePieItemDTO,
  CreateAttendanceReq,
  DriverEarnRewardStatResp,
  FetchDriverEarnStats,
  FindDriverAttendanceReq,
} from "../../dtos/attendance/attendanceDTO";
import mongoose, { ClientSession, Types } from "mongoose";

@injectable()
export class AttendanceRepository
  extends BaseRepository<IAttendanceDocument>
  implements IAttendanceRepository
{
  constructor(
    @inject(TYPES.DriverRepository)
    private _driverRepository: IDriverRepository,
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
  async findDriverAttendance(
    data: FindDriverAttendanceReq,
    session?: ClientSession,
  ) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    return await this.model.findOne(
      {
        driverId: data.driverId,
        wasteplantId: data.plantId,
        assignedTruckId: data.truckId,
        status: "present",
        date: { $gte: startOfToday, $lte: endOfToday },
      },
      null,
      session ? { session } : {},
    );
  }
  async getDriverEarnRewardStats(
    data: FetchDriverEarnStats,
  ): Promise<DriverEarnRewardStatResp[]> {
    const { driverId, filter, from, to } = data;
    console.log("data", data);
    const startDate = new Date(from);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);
    const matchStage: any = {
      driverId: new mongoose.Types.ObjectId(driverId),
      status: "present",
    };
    if (filter === "custom" && from && to) {
      matchStage.date = { $gte: startDate, $lte: endDate };
    }
    let groupStage;
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
    } else if (filter === "custom") {
      groupStage = {
        _id: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
        totalReward: { $sum: "$reward" },
        totalEarning: { $sum: "$earning" },
      };
    } else {
      throw new Error("Invalid filter");
    }
    return await this.model.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: -1 } },
    ]);
  }
  async findAttendancesByDriverId(
    driverId: string,
  ): Promise<AttendancePieItemDTO[]> {

    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0,0,0,0);

    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth()+1,
      0
    );

    endDate.setHours(23, 59, 59, 999);

    const driverObjectId = new Types.ObjectId(driverId);


    return await this.model.aggregate([
      {
        $match: {
          driverId: driverObjectId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$workType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          workType: "$_id",
          count:1,
        },
      },
    ]);
  }
}
