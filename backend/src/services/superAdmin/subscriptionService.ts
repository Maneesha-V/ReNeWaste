import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { ISubscriptionPlan } from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { updateSubscptnData } from "../../types/superAdmin/subscriptionTypes";
import { SubscriptionPlanMapper } from "../../mappers/SubscriptionPlanMapper";
import {
  FetchSubscriptionPlansResp,
  SubsptnPlansDTO,
  updateSubscptnReq,
} from "../../dtos/subscription/subscptnPlanDTO";
import { PaginationInput } from "../../dtos/common/commonDTO";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionRepository: ISubscriptionPlanRepository
  ) {}
  async createSubscriptionPlan(data: SubsptnPlansDTO) {
    const existingPlanName =
      await this.subscriptionRepository.checkPlanNameExist(data.planName!);
    if (existingPlanName) {
      throw new Error("Plan name already exists.");
    }
    const updated = await this.subscriptionRepository.createSubscriptionPlan(
      data
    );
    return !!updated;
  }
  async fetchSubscriptionPlans(
    data: PaginationInput
  ): Promise<FetchSubscriptionPlansResp> {
    const { subscriptionPlans, total } =
      await this.subscriptionRepository.getAllSubscriptionPlans(data);
    return {
      subscriptionPlans:
        SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans),
      total,
    };
  }
  async fetchActiveSubscriptionPlans(): Promise<SubsptnPlansDTO[]> {
    const subscriptionPlans =
      await this.subscriptionRepository.getActiveSubscriptionPlans();
    return SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans);
  }
  async deleteSubscriptionPlan(id: string) {
    const updated =
      await this.subscriptionRepository.deleteSubscriptionPlanById(id);
    return SubscriptionPlanMapper.mapSubscptnPlanDTO(updated);
  }
  async getSubscriptionPlanById(id: string): Promise<SubsptnPlansDTO> {
    const subscriptionPlan =
      await this.subscriptionRepository.getSubscriptionPlanById(id);
    return SubscriptionPlanMapper.mapSubscptnPlanDTO(subscriptionPlan);
  }
  async updateSubscriptionPlanById({
    id,
    data,
  }: updateSubscptnReq): Promise<SubsptnPlansDTO> {
    const existingPlan =
      await this.subscriptionRepository.getSubscriptionPlanById(id);
    if (!existingPlan) {
      throw new Error("Subscription plan not found.");
    }
    if (data.planName && data.planName !== existingPlan.planName) {
      const duplicate = await this.subscriptionRepository.checkPlanNameExist(
        data.planName
      );
      if (duplicate) {
        throw new Error("Plan name already exists.");
      }
    }

    const plan = await this.subscriptionRepository.updateSubscriptionPlanById({
      id,
      data,
    });
    return SubscriptionPlanMapper.mapSubscptnPlanDTO(plan);
  }
}
