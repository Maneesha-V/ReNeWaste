import { SubscriptionPaymentDTO } from "../../../dtos/subscription/subscptnPaymentDTO";
import { SubsptnPlansDTO } from "../../../dtos/subscription/subscptnPlanDTO";
import { ReturnFetchSubptnPlan } from "../../../dtos/wasteplant/WasteplantDTO";

export interface ISubscriptionService {
  fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan>;
  fetchSubscriptionPlans(plantId: string): Promise<SubsptnPlansDTO[]>;
  cancelSubcptReason(
    plantId: string,
    subPayId: string,
    reason: string,
  ): Promise<SubscriptionPaymentDTO>;
}
