import { ISubscriptionPlanDocument } from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";

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
export type plantDataType = {
  createdAt: Date;
  status: string;
  plantName: string;
  ownerName: string;
  license: string;
};
export type ReturnFetchSubptnPlan = {
  plantData: plantDataType;
  subscriptionData: ISubscriptionPlanDocument;
};
