import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { ReturnFetchSubptnPlan } from "../../types/wastePlant/subscriptionTypes";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionRepository: ISubscriptionPlanRepository
  ) {}
  async fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan> {
    const plant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant is not found.");
    }
    if (!plant.subscriptionPlan) {
      throw new Error("Subscription plan not found for this plant.");
    }
    const registeredPlan = await this.subscriptionRepository.checkPlanNameExist(
      plant.subscriptionPlan
    );
    if (!registeredPlan) {
      throw new Error("No such subscription plan found.");
    }
    console.log("plant",plant);
    
    const plantData = { 
      createdAt: plant.createdAt, 
      status: plant.status, 
      plantName: plant.plantName,
      ownerName: plant.ownerName,
      license: plant.licenseNumber
     };
    return { plantData, subscriptionData: registeredPlan };
  }
}
