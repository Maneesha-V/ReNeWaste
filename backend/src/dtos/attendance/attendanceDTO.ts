import { BaseDTO } from "../base/BaseDTO";

export interface AttendanceDTO extends BaseDTO {
       driverId?: string;
       wasteplantId?: string;
       assignedTruckId?: string;
       date: Date;
       status: string;
       workType: string;
       totalPickups: number;
       reward: number;
       earning: number;
       wpEarning: number;
       createdAt?: Date;
       updatedAt?: Date;
}
export type FindDriverAttendanceReq = {
    truckId: string;
    plantId: string;
    driverId: string;
  }
  export type CreateAttendanceReq = {
    driverId: string;
    status: string;
    wasteplantId: string;
    assignedTruckId: string;
}
  export type FetchDriverEarnStats = {
    filter: string;
    driverId: string;
    from: string;
    to: string;
  }
  export interface DriverEarnRewardStatResp {
  _id: {
    day?: string;
    month?: string;
    year?: string;
  };
  totalReward: number;
  totalEarning: number;
}
export interface AttendancePieItemDTO {
  workType: string;
  count: number;
}


