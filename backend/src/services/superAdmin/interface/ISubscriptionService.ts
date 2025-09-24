import { PaginationInput } from "../../../dtos/common/commonDTO";
import {
  FetchSubscriptionPlansResp,
  SubsptnPlansDTO,
  updateSubscptnReq,
} from "../../../dtos/subscription/subscptnPlanDTO";
import { ISubscriptionPlanDocument } from "../../../models/subscriptionPlans/interfaces/subsptnPlanInterface";

export interface ISubscriptionService {
  createSubscriptionPlan(data: SubsptnPlansDTO): Promise<boolean>;
  fetchSubscriptionPlans(
    data: PaginationInput,
  ): Promise<FetchSubscriptionPlansResp>;
  fetchActiveSubscriptionPlans(): Promise<SubsptnPlansDTO[]>;
  deleteSubscriptionPlan(id: string): Promise<any>;
  getSubscriptionPlanById(id: string): Promise<SubsptnPlansDTO>;
  updateSubscriptionPlanById({
    id,
    data,
  }: updateSubscptnReq): Promise<SubsptnPlansDTO>;
}
