export type SubsptnPlanData = {
  billingCycle?: string;
  description?: string;
  driverLimit?: number;
  planName?: string;
  price?: number;
  trialDays?: number;
  truckLimit?: number;
  userLimit?: number;
  status?: string;
  isDeleted?: boolean;
};
export type updateSubscptnData = {
  data: SubsptnPlanData;
  id?: string;
};
export type subPaymnetPayload = {
  amount: number;
  planId: string;
  plantName: string;
};
export type SubcptnPaymtPayload = {
  _id: string;
  planName: string;
  billingCycle: string;
  price: number;
  plantName: string;
  ownerName: string;
  license: string;
};
