export type SubsptnPlanData = {
  billingCycle: string;
  description: string;
  driverLimit: number;
  planName: string;
  price: number;
  trialDays: number;
  truckLimit: number;
  userLimit: number;
  status?: string;
  isDeleted?: boolean;
};

export type updateSubscptnData = {
  id: string;
  data: Partial<SubsptnPlanData>; 
};