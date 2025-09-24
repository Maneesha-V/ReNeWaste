import { IPickupService } from "./interface/IPIckupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { cancelPickupReasonData, PaymentDTO, PickupPlansDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { PaginationInput } from "../../dtos/common/commonDTO";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository,
    @inject(TYPES.NotificationRepository)
    private _notificationRepository: INotificationRepository
  ) {}
  async getPickupPlanService(
    userId: string,
    paginationData: PaginationInput
  ): Promise<{ pickups: PickupPlansDTO[]; total: number }> {
    const { pickupPlans, total } =
      await this._pickupRepository.getPickupPlansByUserId(
        userId,
        paginationData
      );
// console.log("pickupPlans",pickupPlans);

    if (!pickupPlans || pickupPlans.length === 0) {
      throw new Error("No pickup plans found");
    }

    return {
      pickups: PickupRequestMapper.mapToPickupPlansDTO(pickupPlans),
      total,
    };

  }
  async cancelPickupPlanService(pickupReqId: string): Promise<boolean> {
    const pickup = await this._pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new Error("Pickup not found");
    }

    if (pickup.status === "Cancelled") {
      throw new Error("Pickup already canceled");
    }

    const updated = await this._pickupRepository.updatePickupStatus(
      pickupReqId,
      "Cancelled"
    );
    return !!updated;
  }
  async cancelPickupReasonRequest(data: cancelPickupReasonData): Promise<PaymentDTO> {
    const updatedPickupRequest =
      await this._pickupRepository.updatePaymentStatus(data.pickupReqId);
    if (!updatedPickupRequest) throw new Error("Pickup not updated.");
    if (!updatedPickupRequest.wasteplantId) {
      throw new Error("Wasteplant ID not found in pickup request.");
    }
    const io = globalThis.io;

    const plantId = updatedPickupRequest?.wasteplantId.toString();

    const userMessage = `PickupID ${updatedPickupRequest.pickupId} is requested with refund.${data.reason}`;
    const plantNotification =
      await this._notificationRepository.createNotification({
        receiverId: plantId,
        receiverType: "wasteplant",
        senderId: data.userId,
        senderType: "user",
        message: userMessage,
        type: "pickup_refund-req",
      });
    console.log("plantNotification", plantNotification);

    if (io) {
      io.to(`${plantId}`).emit("newNotification", plantNotification);
    }

    return PickupRequestMapper.mapPayment(updatedPickupRequest?.payment);
    
  }
}
