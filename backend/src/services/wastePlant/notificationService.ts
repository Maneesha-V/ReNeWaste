import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { INotificationService } from "./interface/INotificationService";
import { IWasteCollectionRepository } from "../../repositories/wasteCollection/interface/IWasteCollectionRepository";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { NotificationMapper } from "../../mappers/NotificationMapper";
import { NotificationDTO } from "../../dtos/notification/notificationDTO";
import { InputWasteMeasurement } from "../../dtos/wasteCollection/wasteCollectionDTO";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository,
    @inject(TYPES.WasteCollectionRepository)
    private wasteCollectionRepository: IWasteCollectionRepository,
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
  ) {}

  async getNotifications(wasteplantId: string) {
    const notifications =
      await this.notificationRepository.findByReceiverId(wasteplantId);
    if (!notifications) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.NOTIFICATION_NOT_FOUND,
      );
    }
    return NotificationMapper.mapNotificationsDTO(notifications);
  }
  async markNotificationAsRead(
    notifId: string,
    plantId: string,
  ): Promise<NotificationDTO> {
    const notification =
      await this.notificationRepository.markAsReadById(notifId);
    if (!notification || !notification.message) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.NOTIFICATION_NOT_FOUND,
      );
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
        pickupId,
      );
      if (!pickupReq) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.USER.ERROR.PICKUP_NOT_FOUND,
        );
      }
      pickupReq.payment.refundStatus = "Pending";
      await pickupReq.save();

      const io = globalThis.io;

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

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }
    }
    return NotificationMapper.mapNotificationDTO(notification);
  }
  async saveWasteMeasurement(data: InputWasteMeasurement) {
    return await this.wasteCollectionRepository.createWasteMeasurement(data);
  }
}
