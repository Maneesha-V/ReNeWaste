import { inject, injectable } from "inversify";
import { AttendanceModel } from "../../models/attendance/attendanceModel";
import { IAttendanceDocument } from "../../models/attendance/interfaces/attendanceInterface";
import BaseRepository from "../baseRepository/baseRepository";
import { IDriverRepository } from "../driver/interface/IDriverRepository";
import TYPES from "../../config/inversify/types";
import { IAttendanceRepository } from "./interface/IAttendanceRepository";

@injectable()
export class AttendanceRepository
  extends BaseRepository<IAttendanceDocument>
  implements IAttendanceRepository
{
  constructor(
    @inject(TYPES.AttendanceRepository)
    private _driverRepository: IDriverRepository,
  ) {
    super(AttendanceModel);
  }
  
}