import { ReturnFetchSubptnPlan } from "../../../types/wastePlant/subscriptionTypes";

export interface ISubscriptionService {
     fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan>;
}