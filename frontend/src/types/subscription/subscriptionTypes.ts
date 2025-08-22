import { SubscriptionPaymentHisDTO } from "../subscriptionPayment/paymentTypes";

export type SubsptnPlans = {
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
  _id: string;
};

export type FetchSubsptnPlansResp = {
  success: boolean;
  message: string;
  subscriptionPlans: SubsptnPlans[];
  total: number;
};
export type FetchSubsptnPlanByIdResp = {
  subscriptionPlan: SubsptnPlans;
};
export type updateSubscptnReq = {
  data: SubsptnPlans;
  id?: string;
};

export type updateSubscptnResp = {
  updatedSubscriptionPlan: SubsptnPlans;
  message: string;
};
export type DelSubsptnPlansResp = {
  message: string;
  plan: SubsptnPlans;
};
export type PlantData = {
  createdAt: string;
  expiredAt: string;
  license: string;
  ownerName: string;
  plantName: string;
  status: string;
};
export type FetchSubsptnPlanResp = {
  message: string;
  success: boolean;
  selectedPlan: {
    plantData: PlantData;
    subscriptionData: SubsptnPlans;
  };
  subPaymentHistory: {
    paymentData: SubscriptionPaymentHisDTO[];
  };
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