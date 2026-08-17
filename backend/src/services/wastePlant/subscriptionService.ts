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
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

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
    private superAdminRepository: ISuperAdminRepository,
  ) {}
  async fetchSubscriptionPlan(plantId: string): Promise<ReturnFetchSubptnPlan> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }

    const subPlanPaymentData =
      await this._subscriptionPaymentRepository.findPlantSubscriptionPayment(
        plant._id.toString(),
      );
    if (!subPlanPaymentData) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.SUBS_PAYMENT_NOT_FOUND,
      );
    }
    const registeredPlan =
      await this._subscriptionRepository.getSubscriptionPlanById(
        subPlanPaymentData.planId.toString(),
      );
    if (!registeredPlan) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.PLAN_NOT_EXIST,
      );
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
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    const subscriptionPlans =
      await this._subscriptionRepository.getActiveSubscriptionPlans();
    if (!subscriptionPlans) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        "No active subscription plans found.",
      );
    }
    return SubscriptionPlanMapper.mapSubscptnPlansDTO(subscriptionPlans);
  }
  async cancelSubcptReason(
    plantId: string,
    subPayId: string,
    reason: string,
  ): Promise<SubscriptionPaymentDTO> {
    const plant = await this._wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.PICKUP_NOT_FOUND,
      );
    }
    const admin = await this.superAdminRepository.findAdminByRole("superadmin");
    if (!admin) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.NOT_FOUND,
      );
    }
    const updatedSubcptnRequest =
      await this._subscriptionPaymentRepository.updateSubptnPaymentStatus(
        subPayId,
      );
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
    return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(
      updatedSubcptnRequest,
    );
  }
}
