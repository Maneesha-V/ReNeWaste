  export type AttendanceDTO = {
    _id: string;
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
      //  createdAt?: Date;
      //  updatedAt?: Date;
}
  export type DriverEarnRewardStat = {
  _id: {
    day?: string;
    month?: string;
    year?: string;
  };
  totalReward: number;
  totalEarning: number;
}
export type FetchDriverEarnStatsReq = {
  filter: string;
  from?: string;
  to?: string;
}
export type FetchDriverEarnStatsResp = {
    earnRewardStats: DriverEarnRewardStat[];
    success: boolean;
}
export type EarningsData = {
name: string; 
reward: number; 
earning: number
}
export interface AttendancePieItemDTO {
  workType: string;
  count: number;
}