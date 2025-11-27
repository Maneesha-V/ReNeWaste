    export type DriverEarnRewardStat = {
  _id: {
    day?: string;
    month?: string;
    year?: string;
  };
  totalReward: number;
  totalEarning: number;
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