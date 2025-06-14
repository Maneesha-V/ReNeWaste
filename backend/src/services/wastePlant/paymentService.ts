import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IDriverRepository } from "../../repositories/driver/interface/IDriverRepository";
import { PaymentRecord } from "../../repositories/pickupReq/types/pickupTypes";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
  RefundDataReq,
  RetryPaymntPayload,
  ReturnRetryPaymntPayload,
  ReturnSubcptnPaymentResult,
  ReurnSubcptnCreatePaymt,
  SubCreatePaymtPayload,
  UpdateStatusPayload,
  VerifyPaymtPayload,
} from "../../types/wastePlant/paymentTypes";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { ISubscriptionPaymentDocument } from "../../models/subsptnPayment/interface/subsptnPaymentInterface";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository,
    @inject(TYPES.WastePlantRepository)
    private wastePlantRepository: IWastePlantRepository,
    @inject(TYPES.SubscriptionPaymentRepository)
    private subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.SubscriptionPlanRepository)
    private subscriptionRepository: ISubscriptionPlanRepository,
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository
  ) {
    const key_id = process.env.RAZORPAY_KEY_ID!;
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;

    if (!key_id || !key_secret) {
      throw new Error(
        "Razorpay API keys are not defined in environment variables"
      );
    }

    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }
  async fetchPayments(
    data: FetchPaymentPayload
  ): Promise<PaginatedPaymentsResult> {
    return await this.pickupRepository.fetchAllPaymentsByPlantId(data);
  }

  async createPaymentOrder(
    data: SubCreatePaymtPayload
  ): Promise<ReurnSubcptnCreatePaymt> {
    const { plantId, planId, amount, plantName } = data;
    const plant = await this.wastePlantRepository.findWastePlantByName(
      plantName
    );
    console.log("plant ", plant);
    if (!plant) {
      throw new Error("Plant not found.");
    }
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${plantId}_${Date.now().toString().slice(-4)}`,
      notes: {
        plantId,
        planId,
      },
      payment_capture: true,
    });
    const paymentRecord =
      await this.subscriptionPaymentRepository.createSubscriptionPayment({
        plantId,
        planId,
        amount,
        paymentDetails: {
          method: "Razorpay",
          status: "Pending",
          razorpayOrderId: order.id,
          razorpayPaymentId: null,
          razorpaySignature: null,
          paidAt: null,
          refundRequested: false,
          refundStatus: null,
          refundAt: null,
        },
      });
    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      subscriptionPaymentId: paymentRecord._id.toString(),
    };
  }

  async verifyPaymentService(
    data: VerifyPaymtPayload
  ): Promise<ISubscriptionPaymentDocument> {
    const { paymentData, plantId } = data;
    const body = `${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== paymentData.razorpay_signature) {
      throw new Error("Invalid signature. Payment could not be verified.");
    }

    const paymentUpdate = {
      status: "Paid",
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpaySignature: paymentData.razorpay_signature,
      amount: paymentData.amount / 100,
      paidAt: new Date(),
    };

    const updatedPayment =
      await this.subscriptionPaymentRepository.updateSubscriptionPayment({
        planId: paymentData.planId,
        paymentUpdate,
        plantId,
      });

    return updatedPayment;
  }
  async fetchSubscriptionPayments(
    plantId: string
  ): Promise<ReturnSubcptnPaymentResult> {
    const plant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant not found.");
    }
    if (!plant.subscriptionPlan) {
      throw new Error("Subscription plan not found for this plant.");
    }
    const subptnPlanData = await this.subscriptionRepository.checkPlanNameExist(
      plant?.subscriptionPlan
    );
    if (!subptnPlanData || !subptnPlanData._id) {
      throw new Error("Subscription plan not exist.");
    }
    const paymentData =
      await this.subscriptionPaymentRepository.findSubscriptionPayments(
        plantId,
        subptnPlanData._id.toString()
      );
    const planData = {
      planName: subptnPlanData.planName,
      plantName: plant.plantName,
      ownerName: plant.ownerName,
    };
    return { paymentData, planData };
  }
  async retrySubscriptionPayment(
    data: RetryPaymntPayload
  ): Promise<ReturnRetryPaymntPayload> {
    const { plantId, planId, amount, subPaymtId } = data;
    const subptnPaymentData =
      await this.subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPaymtId
      );
    if (!subptnPaymentData) {
      throw new Error("Payment not found.");
    }

    const paymentUpdate = {
      amount: amount * 100,
      method: "Razorpay",
      status: "Pending",
      razorpayOrderId: subptnPaymentData.razorpayOrderId || null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      refundRequested: false,
      refundStatus: null,
      refundAt: null,
    };

    const updatedData =
      await this.subscriptionPaymentRepository.updateSubscriptionPaymentById(
        subptnPaymentData._id.toString(),
        paymentUpdate
      );
    if (!updatedData.razorpayOrderId || !updatedData.planId) {
      throw new Error("Can't update payment");
    }
    return {
      orderId: updatedData.razorpayOrderId,
      amount: updatedData.amount,
      currency: "INR",
      planId: updatedData.planId.toString(),
    };
  }
  async updateRefundStatusPayment(data: UpdateStatusPayload) {
    const { plantId, statusUpdateData } = data;
    const { pickupReqId, status } = statusUpdateData;
    console.log({ data, statusUpdateData });

    const pickupReq = await this.pickupRepository.getPickupById(pickupReqId);
    console.log("pickupReq", pickupReq);

    if (pickupReq.wasteplantId?.toString() !== plantId) {
      throw new Error("Not belongs in wasteplant.");
    }
    pickupReq.payment.refundStatus = status;
    await pickupReq.save();

     const io = global.io;

      const userId = pickupReq.userId.toString();
      const userMessage = `Refund process started for Pickup ID ${pickupReq.pickupId}.`;
      const userNotification =
        await this.notificationRepository.createNotification({
          receiverId: userId,
          receiverType: "user",
          senderId: plantId,
          senderType: "wasteplant",
          message: userMessage,
          type: "pickup_refund-processing",
        });
      console.log("userNotification", userNotification);

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }

    return pickupReq;
  }
  async refundPayment(plantId: string, data: RefundDataReq) {
    const pickupReq = await this.pickupRepository.getPickupById(
      data.pickupReqId
    );
    console.log("pickupReq", pickupReq);

    if (pickupReq.wasteplantId?.toString() !== plantId) {
      throw new Error("PickupReq not belongs in this wasteplant.");
    }
    if (
      pickupReq.payment.razorpayPaymentId !== data.razorpayPaymentId ||
      pickupReq.payment.amount !== data.amount
    ) {
      throw new Error("Payment details do not match.");
    }

    try {
      const paymentDetails = await this.razorpay.payments.fetch(
        data.razorpayPaymentId
      );
      console.log("paymentDetails", paymentDetails);
      if (paymentDetails.status !== "captured") {
        throw new Error("Payment is not captured and cannot be refunded.");
      }
      if (process.env.NODE_ENV === "production") {
        const refund = await this.razorpay.payments.refund(
          data.razorpayPaymentId,
          {
            amount: paymentDetails.amount,
            speed: "normal",
          }
        );

        pickupReq.payment.razorpayRefundId = refund.id;
      } else {
        console.log("Simulating refund success in TEST MODE");
        pickupReq.payment.razorpayRefundId = `test_refund_${Date.now()}`;
      }

      pickupReq.payment.refundStatus = "Refunded";
      pickupReq.payment.refundAt = new Date();

      await pickupReq.save();
      const io = global.io;

      const userId = pickupReq.userId.toString();
      const userMessage = `Refund processed successfully for Pickup ID ${pickupReq.pickupId}. Amount ₹${pickupReq.payment.amount} will be credited soon.`;
      const userNotification =
        await this.notificationRepository.createNotification({
          receiverId: userId,
          receiverType: "user",
          senderId: plantId,
          senderType: "wasteplant",
          message: userMessage,
          type: "pickup_refund-completed",
        });
      console.log("userNotification", userNotification);

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }

      return pickupReq;
    } catch (error: any) {
      console.error("Refund failed:", JSON.stringify(error, null, 2));
      throw new Error(error?.error?.description || "Refund failed");
    }
  }
}
