import { ISubscriptionPlan, ISubscriptionPlanDocument } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { updateSubscptnData } from "../../../types/superAdmin/subscriptionTypes";

export interface ISubscriptionPlanRepository {
    createSubscriptionPlan(data: ISubscriptionPlan): Promise<ISubscriptionPlanDocument>;
    getAllSubscriptionPlans(): Promise<ISubscriptionPlanDocument[] | null>;
    deleteSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument | null>;
    getSubscriptionPlanById(planId: string): Promise<ISubscriptionPlanDocument | null>;
    updateSubscriptionPlanById({id, data}: updateSubscptnData): Promise<ISubscriptionPlanDocument | null>;
    checkPlanNameExist(planName: string): Promise<ISubscriptionPlanDocument | null>
}