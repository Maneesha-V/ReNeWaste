import { IPickupService } from "./interface/IPIckupService";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import {
  cancelPickupReasonData,
  PaymentDTO,
  PickupPlansDTO,
} from "../../dtos/pickupReq/pickupReqDTO";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";

@injectable()
export class PickupService implements IPickupService {
  constructor(
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository,
    @inject(TYPES.NotificationRepository)
    private _notificationRepository: INotificationRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
  ) {}
  async getPickupPlanService(
    userId: string,
    paginationData: PaginationInput,
  ): Promise<{ pickups: PickupPlansDTO[]; total: number }> {
    const { pickupPlans, total } =
      await this._pickupRepository.getPickupPlansByUserId(
        userId,
        paginationData,
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
      "Cancelled",
    );
    return !!updated;
  }
  async cancelPickupReasonRequest(
    data: cancelPickupReasonData,
  ): Promise<PaymentDTO> {
    const updatedPickupRequest =
      await this._pickupRepository.updatePaymentStatus(data.pickupReqId);
    if (!updatedPickupRequest) throw new Error("Pickup not updated.");
    if (updatedPickupRequest.payment?.payoutStatus === "Completed") {
      throw new Error("Refund not allowed after payout released.");
    }

    if (!updatedPickupRequest.wasteplantId) {
      throw new Error("Wasteplant ID not found in pickup request.");
    }
    const userWallet = await this._walletRepository.findWallet(
      data.userId,
      "User",
    );
    if (!userWallet) {
      throw new Error("User wallet not found.");
    }
    const cancelPickupTransaction = userWallet.transactions.find(
      (tx) =>
        tx.subType === "PickupPayment" &&
        tx.pickupReqId?.toString() === data.pickupReqId,
    );
    if (!cancelPickupTransaction)
      throw new Error("Pickup payment transaction not found.");
    if (cancelPickupTransaction.status !== "Paid") {
      throw new Error("Payment not completed. Refund not allowed.");
    }
    if (cancelPickupTransaction.refundRequested) {
      throw new Error("Refund already requested.");
    }
    if (userWallet.holdingBalance < cancelPickupTransaction.amount) {
      throw new Error("Refund cannot be processed. Amount already settled.");
    }

    cancelPickupTransaction.refundRequested = true;
    cancelPickupTransaction.refundStatus = "Pending";
    await userWallet.save();

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
 

    if (io) {
      io.to(`${plantId}`).emit("newNotification", plantNotification);
    }

    return PickupRequestMapper.mapPayment(updatedPickupRequest?.payment);
  }
}
