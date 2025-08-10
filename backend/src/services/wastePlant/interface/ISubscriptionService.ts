import { SubsptnPlansDTO } from "../../../dtos/subscription/subscptnPlanDTO";
import { ReturnFetchSubptnPlan } from "../../../types/wastePlant/subscriptionTypes";

export interface ISubscriptionService {
     fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan>;
     fetchSubscriptionPlans(plantId: string): Promise<SubsptnPlansDTO[]>
}