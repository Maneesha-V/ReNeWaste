import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { ISubscriptionService } from "./interface/ISubscriptionService";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { SubscriptionPlanMapper } from "../../mappers/SubscriptionPlanMapper";
import { SubsptnPlansDTO } from "../../dtos/subscription/subscptnPlanDTO";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { ReturnFetchSubptnPlan } from "../../dtos/wasteplant/WasteplantDTO";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import { sendNotification } from "../../utils/notificationUtils";
import { SubscriptionPaymentMapper } from "../../mappers/SubscriptionPaymentMapper";
import { SubscriptionPaymentDTO } from "../../dtos/subscription/subscptnPaymentDTO";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private _subscriptionRepository: ISubscriptionPlanRepository,
    @inject(TYPES.SubscriptionPaymentRepository)
    private _subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.SuperAdminRepository)
    private superAdminRepository: ISuperAdminRepository
  ) {}
  async fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant is not found.");
    }

    console.log("plant", plant);
    const subPlanPaymentData =
      await this._subscriptionPaymentRepository.findPlantSubscriptionPayment(
        plant._id.toString()
      );
    if (!subPlanPaymentData) {
      throw new Error("No such subscription payment found.");
    }
    const registeredPlan =
      await this._subscriptionRepository.getSubscriptionPlanById(
        subPlanPaymentData.planId.toString()
      );
    if (!registeredPlan) {
      throw new Error("No such subscription plan found.");
    }
    const plantData = {
      createdAt: plant.createdAt,
      status: plant.status,
      plantName: plant.plantName,
      ownerName: plant.ownerName,
      license: plant.licenseNumber,
      expiredAt: subPlanPaymentData.expiredAt,
    };
    return {
      plantData,
      subscriptionData:
        SubscriptionPlanMapper.mapSubscptnPlanDTO(registeredPlan),
    };
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
  async cancelSubcptReason(
    plantId: string,
    subPayId: string,
    reason: string
  ): Promise<SubscriptionPaymentDTO> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if(!plant){
      throw new Error("Plant not found.")
    }
    const admin = await this.superAdminRepository.findAdminByRole("superadmin");
    if (!admin) {
      throw new Error("Superadmin not found.");
    }
    const updatedSubcptnRequest =
      await this._subscriptionPaymentRepository.updateSubptnPaymentStatus(subPayId);
        const adminMessage = `Plant: ${plant.plantName} is requested with refund-${reason}-
        SubPaymentId-${updatedSubcptnRequest._id.toString()}`;
          const adminId = admin._id.toString();
          await sendNotification({
            receiverId: adminId,
            receiverType: admin.role,
            senderId: plantId,
            senderType: "wasteplant",
            message: adminMessage,
            type: "subscriptn-refund-req",
          });
          return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(updatedSubcptnRequest);
  }
}
