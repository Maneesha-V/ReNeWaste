import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { InputWasteMeasurement } from "../../repositories/wasteCollection/types/wasteCollectionTypes";
import { INotificationDocument } from "../../models/notification/interfaces/notificationInterface";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
  ) {}

  async getNotifications(wasteplantId: string) {
    return await this.notificationRepository.findByReceiverId(wasteplantId);
  }
  async markNotificationAsRead(
    notifId: string,
    plantId: string
  ): Promise<INotificationDocument | null> {
    const notification = await this.notificationRepository.markAsReadById(
      notifId
    );
    if (!notification || !notification.message) {
      throw new Error("Notification not found.");
    }

    if (
      notification.senderType === "user" &&
      notification.type === "pickup_refund-req"
    ) {
      const extractPickupId = notification.message.split(" ");
      const pickupId = extractPickupId[1];
      const pickupReq = await this.pickupRepository.getPickupWithUserAndPlantId(
        plantId,
        notification.senderId.toString(),
        pickupId
      );
      if (!pickupReq) {
        throw new Error("PickupRequest not found.");
      }
      pickupReq.payment.refundStatus = "Pending";
      await pickupReq.save();
      
      const io = global.io;

      const userId = pickupReq.userId.toString();
      const userMessage = `Pickup ID ${pickupReq.pickupId} refund request is under review.`;
      const userNotification =
        await this.notificationRepository.createNotification({
          receiverId: userId,
          receiverType: "user",
          senderId: plantId,
          senderType: "wasteplant",
          message: userMessage,
          type: "pickup_refund-pending",
        });
      console.log("userNotification", userNotification);

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }
    }
    return notification;
  }
  async saveWasteMeasurement(data: InputWasteMeasurement) {
    return await this.wasteCollectionRepository.createWasteMeasurement(data);
  }
}
