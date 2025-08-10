import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { ReturnFetchSubptnPlan } from "../../types/wastePlant/subscriptionTypes";
import { SubscriptionPlanMapper } from "../../mappers/SubscriptionPlanMapper";
import { SubsptnPlansDTO } from "../../dtos/subscription/subscptnPlanDTO";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private _subscriptionRepository: ISubscriptionPlanRepository
  ) {}
  async fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant is not found.");
    }
    if (!plant.subscriptionPlan) {
      throw new Error("Subscription plan not found for this plant.");
    }
    const registeredPlan =
      await this._subscriptionRepository.checkPlanNameExist(
        plant.subscriptionPlan
      );
    if (!registeredPlan) {
      throw new Error("No such subscription plan found.");
    }
    console.log("plant", plant);

    const plantData = {
      createdAt: plant.createdAt,
      status: plant.status,
      plantName: plant.plantName,
      ownerName: plant.ownerName,
      license: plant.licenseNumber,
    };
    return { plantData, subscriptionData: registeredPlan };
  }
  async fetchSubscriptionPlans(plantId: string): Promise<SubsptnPlansDTO[]> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant is not found.");
    }
    const subscriptionPlans =
      await this._subscriptionRepository.getActiveSubscriptionPlans();
    if (!subscriptionPlans) {
      throw new Error("No active subscription plans found.");
    }
    return SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans);
  }
}
