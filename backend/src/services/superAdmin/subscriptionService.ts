import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { ISubscriptionPlan } from "../../models/subscriptionPlans/interfaces/subsptnPlanInterface";
import { updateSubscptnData } from "../../types/superAdmin/subscriptionTypes";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionRepository: ISubscriptionPlanRepository
  ) {}
  async createSubscriptionPlan(data: ISubscriptionPlan) {
    const existingPlanName =
    await this.subscriptionRepository.checkPlanNameExist(data.planName);
    if (existingPlanName) {
      throw new Error("Plan name already exists.");
    }
    return await this.subscriptionRepository.createSubscriptionPlan(data);
  }
  async fetchSubscriptionPlans() {
    return await this.subscriptionRepository.getAllSubscriptionPlans();
  }
  async deleteSubscriptionPlan(id: string) {
    return await this.subscriptionRepository.deleteSubscriptionPlanById(id);
  }
  async getSubscriptionPlanById(id: string) {
    return await this.subscriptionRepository.getSubscriptionPlanById(id);
  }
  async updateSubscriptionPlanById({ id, data }: updateSubscptnData) {
    return await this.subscriptionRepository.updateSubscriptionPlanById({
      id,
      data,
    });
  }
}
