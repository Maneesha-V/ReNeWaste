import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import {
  PaginatedReturnPaymentHis,
  SubscriptionPaymentDTO,
  SubscriptionPaymentHisResult,
  UpdateRefundStatusReq,
} from "../../dtos/subscription/subscptnPaymentDTO";
import { SubscriptionPaymentMapper } from "../../mappers/SubscriptionPaymentMapper";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { sendNotification } from "../../utils/notificationUtils";

@injectable()
export class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.SubscriptionPaymentRepository)
    private _subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository
  ) {}
  async fetchPayments(
    data: PaginationInput
  ): Promise<SubscriptionPaymentHisResult> {
    const paymentHisData =
      await this._subscriptionPaymentRepository.getAllSubscptnPayments(data);
    if (!paymentHisData) {
      throw new Error("Payment history not found.");
    }

    return paymentHisData;
  }
  async updateRefundStatusPayment(
    data: UpdateRefundStatusReq
  ): Promise<SubscriptionPaymentDTO> {
    const { subPayId, refundStatus, adminId } = data;
    const payment =
      await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPayId
      );
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (
      payment.inProgressExpiresAt &&
      new Date(payment.inProgressExpiresAt) > new Date()
    ) {
      const expireTime = new Date(
        payment.inProgressExpiresAt
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      throw new Error(
        `Refund is already being processed. Try again after ${expireTime}.`
      );
    }
    // await this._subscriptionPaymentRepository.updateRefundStatusPayment(data);
    payment.refundStatus = refundStatus;
    const plant = await this._wastePlantRepository.getWastePlantById(
      payment.wasteplantId.toString()
    );
    if (!plant) throw new Error("Plant not found.");

    if (refundStatus === "Processing") {
      payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const plantMessage = `Refund process started for ${plant.plantName}.`;

      await sendNotification({
        receiverId: plant._id.toString(),
        receiverType: plant.role,
        senderId: adminId,
        senderType: "superadmin",
        message: plantMessage,
        type: "subscriptn-refund-processing",
      });
    } else if (refundStatus === "Refunded") {
      payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      const plantMessage = `Refund process completed for ${plant.plantName}.`;

      await sendNotification({
        receiverId: plant._id.toString(),
        receiverType: plant.role,
        senderId: adminId,
        senderType: "superadmin",
        message: plantMessage,
        type: "subscriptn-refund-completed",
      });
    } else {
      payment.inProgressExpiresAt = null;
    }
    await payment.save();

    return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
    // const payment = await this._subscriptionPaymentRepository.updateRefundStatusPayment(data);
  }
}
