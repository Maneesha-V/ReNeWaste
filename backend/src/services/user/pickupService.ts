import { IPickupService } from "./interface/IPIckupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { cancelPickupReasonData } from "../../types/user/pickupTypes";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}
  async getPickupPlanService(userId: string) {
    const pickups = await this.pickupRepository.getPickupPlansByUserId(userId);
    console.log("pickups", pickups);

    if (!pickups) throw new Error("No pickup plans found");
    return pickups;
  }
  async cancelPickupPlanService(pickupReqId: string) {
    const pickup = await this.pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new Error("Pickup not found");
    }
    console.log("user-pickup", pickup);

    if (pickup.status === "Cancelled") {
      throw new Error("Pickup already canceled");
    }

    return await this.pickupRepository.updatePickupStatus(
      pickupReqId,
      "Cancelled"
    );
  }
  async cancelPickupReasonRequest(data: cancelPickupReasonData) {
    const updatedPickupRequest =
      await this.pickupRepository.updatePaymentStatus(data.pickupReqId);
      if (!updatedPickupRequest) throw new Error("Pickup not updated.");
      if (!updatedPickupRequest.wasteplantId) {
  throw new Error("Wasteplant ID not found in pickup request.");
}
    const io = global.io;

    const plantId = updatedPickupRequest?.wasteplantId.toString();

    const userMessage = `PickupID ${updatedPickupRequest.pickupId} is requested with refund.${data.reason}`;
    const plantNotification =
      await this.notificationRepository.createNotification({
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

    return updatedPickupRequest;
  }
}
