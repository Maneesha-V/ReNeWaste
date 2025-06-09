import { ISubscriptionPlan, ISubscriptionPlanDocument } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { updateSubscptnData } from "../../../types/superAdmin/subscriptionTypes";

export interface ISubscriptionService {
    createSubscriptionPlan(data: ISubscriptionPlan): Promise<ISubscriptionPlan>;
    fetchSubscriptionPlans(): Promise<ISubscriptionPlanDocument[] | null>
    deleteSubscriptionPlan(id: string): Promise<any>;
    getSubscriptionPlanById(id: string): Promise<ISubscriptionPlanDocument | null>;
    updateSubscriptionPlanById({id, data}: updateSubscptnData): Promise<ISubscriptionPlanDocument | null>;
}