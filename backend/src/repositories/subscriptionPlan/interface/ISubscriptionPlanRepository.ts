import { PaginationInput } from "../../../dtos/common/commonDTO";
import { updateSubscptnData } from "../../../dtos/subscription/subscptnPaymentDTO";
import { PaginatedSubsptnPlansResult, SubsptnPlansDTO } from "../../../dtos/subscription/subscptnPlanDTO";
import { ISubscriptionPlanDocument } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";

export interface ISubscriptionPlanRepository {
    createSubscriptionPlan(data: SubsptnPlansDTO): Promise<ISubscriptionPlanDocument>;
    getAllSubscriptionPlans(data: PaginationInput): Promise<PaginatedSubsptnPlansResult>;
    getActiveSubscriptionPlans(): Promise<ISubscriptionPlanDocument[]>;
    deleteSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument>;
    getSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument>;
    updateSubscriptionPlanById({id, data}: updateSubscptnData): Promise<ISubscriptionPlanDocument>;
    checkPlanNameExist(planName: string): Promise<ISubscriptionPlanDocument | null>
}