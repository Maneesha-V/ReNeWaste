import { ISubscriptionPlanDocument, PaginatedSubsptnPlansResult, updateSubscptnData, UpdateSubsptnPlans } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { PaginationInputReq } from "../../../models/wastePlant/interfaces/wastePlantInterface";

export interface ISubscriptionPlanRepository {
  createSubscriptionPlan(
    data: UpdateSubsptnPlans,
  ): Promise<ISubscriptionPlanDocument>;
  getAllSubscriptionPlans(
    data: PaginationInputReq,
  ): Promise<PaginatedSubsptnPlansResult>;
  getActiveSubscriptionPlans(): Promise<ISubscriptionPlanDocument[]>;
  deleteSubscriptionPlanById(
    planId: string,
  ): Promise<ISubscriptionPlanDocument>;
  getSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument>;
  updateSubscriptionPlanById({
    id,
    data,
  }: updateSubscptnData): Promise<ISubscriptionPlanDocument>;
  checkPlanNameExist(
    planName: string,
  ): Promise<ISubscriptionPlanDocument | null>;
}
