import { PaginationInput } from "../../../dtos/common/commonDTO";
import { PaginatedSubsptnPlansResult, SubsptnPlansDTO } from "../../../dtos/subscription/subscptnPlanDTO";
import { ISubscriptionPlan, ISubscriptionPlanDocument } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { updateSubscptnData } from "../../../types/superAdmin/subscriptionTypes";

export interface ISubscriptionPlanRepository {
    createSubscriptionPlan(data: SubsptnPlansDTO): Promise<ISubscriptionPlanDocument>;
    getAllSubscriptionPlans(data: PaginationInput): Promise<PaginatedSubsptnPlansResult>;
    getActiveSubscriptionPlans(): Promise<ISubscriptionPlanDocument[]>;
    deleteSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument>;
    getSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument>;
    updateSubscriptionPlanById({id, data}: updateSubscptnData): Promise<ISubscriptionPlanDocument>;
    checkPlanNameExist(planName: string): Promise<ISubscriptionPlanDocument | null>
}