import { ISubscriptionPlanDocument } from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { BaseDTO } from "../base/BaseDTO";

export interface SubsptnPlansDTO extends BaseDTO {
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
export type updateSubscptnReq = {
  id: string;
  data: Partial<SubsptnPlansDTO>; 
};
export type PaginatedSubsptnPlansResult = {
  subscriptionPlans: ISubscriptionPlanDocument[];
  total: number;
}
export type FetchSubscriptionPlansResp = {
  subscriptionPlans: SubsptnPlansDTO[];
  total: number;
}