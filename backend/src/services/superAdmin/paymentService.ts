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
import Razorpay from "razorpay";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor(
    @inject(TYPES.SubscriptionPaymentRepository)
    private _subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
  ) {
    const key_id = process.env.RAZORPAY_KEY_ID!;
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;

    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay API keys are not defined in environment variables",
      );
    }

    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }
  async fetchPayments(
    data: PaginationInput,
  ): Promise<SubscriptionPaymentHisResult> {
    const paymentHisData =
      await this._subscriptionPaymentRepository.getAllSubscptnPayments(data);
    if (!paymentHisData) {
      throw new Error("Payment history not found.");
    }

    return paymentHisData;
  }
  async updateRefundStatusPayment(
    data: UpdateRefundStatusReq,
  ): Promise<SubscriptionPaymentDTO> {
    const { subPayId, refundStatus, adminId } = data;
    const payment =
      await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPayId,
      );
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (
      payment.inProgressExpiresAt &&
      new Date(payment.inProgressExpiresAt) > new Date()
    ) {
      const expireTime = new Date(
        payment.inProgressExpiresAt,
      ).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      throw new Error(
        `Refund is already being processed. Try again after ${expireTime}.`,
      );
    }
    payment.refundStatus = refundStatus;

    const plant = await this._wastePlantRepository.getWastePlantById(
      payment.wasteplantId.toString(),
    );
    if (!plant) throw new Error("Plant not found.");
    let plantMessage = "";
    let notificationType = "";

    if (refundStatus) {
      if (["Pending", "Processing"].includes(refundStatus)) {
        payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      } else {
        payment.inProgressExpiresAt = null;
      }

      payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      switch (refundStatus) {
        case "Pending":
          plantMessage = `Refund process started for ${plant.plantName}.`;
          notificationType = "subscriptn-refund-pending";
          break;

        case "Processing":
          plantMessage = `Refund is currently being processed for ${plant.plantName}.`;
          notificationType = "subscriptn-refund-processing";
          break;

        case "Rejected":
          plantMessage = `Refund has been rejected for ${plant.plantName}.`;
          notificationType = "subscriptn-refund-rejected";
          break;
        default:
          plantMessage = `Refund status updated for ${plant.plantName}.`;
          notificationType = "general";
      }

      await sendNotification({
        receiverId: plant._id.toString(),
        receiverType: plant.role,
        senderId: adminId,
        senderType: "superadmin",
        message: plantMessage,
        type: notificationType,
      });
    } else {
      payment.inProgressExpiresAt = null;
    }
    await payment.save();

    return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
  }
  async refundPayment(
    data: UpdateRefundStatusReq,
  ): Promise<SubscriptionPaymentDTO> {
    const { subPayId, refundStatus, adminId } = data;
    const payment =
      await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPayId,
      );
    if (!payment) {
      throw new Error("Payment not found");
    }
    const plant = await this._wastePlantRepository.getWastePlantById(
      payment.wasteplantId.toString(),
    );
    if (!plant) throw new Error("Plant not found.");

    if (refundStatus === "Refunded") {
      payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      if (!payment.razorpayPaymentId) {
        throw new Error(
          "Razorpay Payment ID is missing, refund cannot be processed.",
        );
      }
      try {
        const paymentDetails = await this.razorpay.payments.fetch(
          payment.razorpayPaymentId,
        );
        console.log("paymentDetails", paymentDetails);
        if (paymentDetails.status !== "captured") {
          throw new Error("Payment is not captured and cannot be refunded.");
        }
        if (process.env.NODE_ENV === "production") {
          const refund = await this.razorpay.payments.refund(
            payment.razorpayPaymentId,
            {
              amount: paymentDetails.amount,
              speed: "normal",
            },
          );

          payment.razorpayRefundId = refund.id;
        } else {
          console.log("Simulating refund success in TEST MODE");
          payment.razorpayRefundId = `test_refund_${Date.now()}`;
        }

        payment.refundStatus = "Refunded";
        payment.refundAt = new Date();

        const plantMessage = `Refund process completed for ${plant.plantName}.`;

        await sendNotification({
          receiverId: plant._id.toString(),
          receiverType: plant.role,
          senderId: adminId,
          senderType: "superadmin",
          message: plantMessage,
          type: "subscriptn-refund-completed",
        });
      } catch (error: any) {
        console.error("Refund failed:", JSON.stringify(error, null, 2));
        throw new Error(error?.error?.description || "Refund failed");
      }
    } else {
      payment.inProgressExpiresAt = null;
    }
    await payment.save();
    plant.status = "Inactive";
    await plant.save();
    return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
  }
}
