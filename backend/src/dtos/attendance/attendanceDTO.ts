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
