import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPaymentService } from "./interface/IPaymentService";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import Razorpay from "razorpay";
import crypto from "crypto";
import { IWastePlantRepository } from "../../repositories/wastePlant/interface/IWastePlantRepository";
import { ISubscriptionPaymentRepository } from "../../repositories/subscriptionPayment/interface/ISubscriptionPaymentRepository";
import { ISubscriptionPlanRepository } from "../../repositories/subscriptionPlan/interface/ISubscriptionPlanRepository";
import { INotificationRepository } from "../../repositories/notification/interface/INotifcationRepository";
import { ISuperAdminRepository } from "../../repositories/superAdmin/interface/ISuperAdminRepository";
import {
  RefundStatusUpdateResp,
  UpdateStatusReq,
} from "../../dtos/pickupReq/paymentDTO";
import {
  RetrySubPaymntReq,
  RetrySubPaymntRes,
  SubCreatePaymtReq,
  SubCreatePaymtResp,
} from "../../dtos/subscription/subscptnPaymentDTO";
import {
  FetchPaymentPayload,
  PaginatedPaymentsResult,
  RefundDataReq,
  ReturnSubcptnPaymentResult,
  VerifyPaymtReq,
  VerifyPaymtResp,
} from "../../dtos/wasteplant/WasteplantDTO";
import { sendNotification } from "../../utils/notificationUtils";
import { SubscriptionPaymentMapper } from "../../mappers/SubscriptionPaymentMapper";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";

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
    private notificationRepository: INotificationRepository,
    @inject(TYPES.SuperAdminRepository)
    private superAdminRepository: ISuperAdminRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
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
    data: FetchPaymentPayload,
  ): Promise<PaginatedPaymentsResult> {
    return await this.pickupRepository.fetchAllPaymentsByPlantId(data);
  }

  async createPaymentOrder(
    data: SubCreatePaymtReq,
  ): Promise<SubCreatePaymtResp> {
    const { plantId, planId } = data;
    const plant = await this.wastePlantRepository.getWastePlantById(plantId);

    if (!plant) {
      throw new Error("Plant not found.");
    }
    // if (!plant.subscriptionPlan) {
    //   throw new Error("Subscription plan not found.");
    // }
    const existingPlan = await this.subscriptionRepository.checkPlanNameExist(
      plant.subscriptionPlan!,
    );
    if (!existingPlan || existingPlan.status !== "Active") {
      throw new Error("This subscription plan is not active.");
    }
    const existingInProgressPayment =
      await this.subscriptionPaymentRepository.findLatestInProgressPayment(
        plantId,
      );

    const now = new Date();
    if (
      existingInProgressPayment &&
      existingInProgressPayment.status === "InProgress" &&
      existingInProgressPayment.inProgressExpiresAt &&
      existingInProgressPayment.inProgressExpiresAt <= now
    ) {
      existingInProgressPayment.status = "Pending";
      existingInProgressPayment.inProgressExpiresAt = null;
    }
    if (
      existingInProgressPayment &&
      existingInProgressPayment.status === "InProgress" &&
      existingInProgressPayment.inProgressExpiresAt &&
      existingInProgressPayment.inProgressExpiresAt > now
    ) {
      const remainingMinutes = Math.ceil(
        (existingInProgressPayment.inProgressExpiresAt.getTime() -
          now.getTime()) /
          1000 /
          60,
      );
      throw new Error(
        `A payment is already in progress. Please try again after ${remainingMinutes} minutes.`,
      );
    }

    const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const order = await this.razorpay.orders.create({
      amount: existingPlan.price * 100,
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
        amount: existingPlan.price,
        paymentDetails: {
          method: "Razorpay",
          status: "InProgress",
          razorpayOrderId: order.id,
          razorpayPaymentId: null,
          razorpaySignature: null,
          paidAt: null,
          refundRequested: false,
          refundStatus: null,
          refundAt: null,
          inProgressExpiresAt: newExpiry,
        },
      });
    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      subscriptionPaymentId: paymentRecord._id.toString(),
    };
  }

  async verifyPaymentService(data: VerifyPaymtReq): Promise<VerifyPaymtResp> {
    const { paymentData, plantId } = data;
    console.log("paymentData", paymentData);

    const body = `${paymentData.razorpay_order_id}|${paymentData.razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== paymentData.razorpay_signature) {
      throw new Error("Invalid signature. Payment could not be verified.");
    }
    const paidAt = new Date();
    let expiredAt: Date;

    if (paymentData.billingCycle === "Monthly") {
      expiredAt = new Date(paidAt);
      expiredAt.setDate(paidAt.getDate() + 30);
      // expiredAt.setMinutes(paidAt.getMinutes() + 10);
    } else {
      expiredAt = new Date(paidAt);
      expiredAt.setDate(paidAt.getDate() + 360);
    }
    const paymentUpdate = {
      status: "Paid",
      razorpayOrderId: paymentData.razorpay_order_id,
      razorpayPaymentId: paymentData.razorpay_payment_id,
      razorpaySignature: paymentData.razorpay_signature,
      amount: paymentData.amount,
      paidAt,
      expiredAt,
      inProgressExpiresAt: null,
    };

    const updatedPayment =
      await this.subscriptionPaymentRepository.updateSubscriptionPayment({
        planId: paymentData.planId,
        paymentUpdate,
        plantId,
      });
    const plant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant not found to update status to Active.");
    }
    const plan = await this.subscriptionRepository.getSubscriptionPlanById(
      paymentData.planId,
    );
    if (!plan) {
      throw new Error("Plan not exist.");
    }
    plant.status = "Active";
    plant.subscriptionPlan = plan.planName;
    plant.autoRechargeAt = expiredAt;
    plant.rechargeNotificationSent = false;
    plant.renewNotificationSent = false;
    await plant.save();
    const admin = await this.superAdminRepository.findAdminByRole("superadmin");
    if (!admin) {
      throw new Error("Superadmin not found.");
    }
    const plantMessage = `${plant.plantName} have successfully recharged with subscription plan (${plant.subscriptionPlan}, ${paymentData.billingCycle}).`;
    const adminId = admin._id.toString();
    await sendNotification({
      receiverId: plant._id.toString(),
      receiverType: plant.role,
      senderId: adminId,
      senderType: "superadmin",
      message: plantMessage,
      type: "subscribe_recharged",
    });

    return {
      subPayId: updatedPayment._id.toString(),
      expiredAt: updatedPayment.expiredAt,
    };
  }
  async fetchSubscriptionPayments(
    plantId: string,
  ): Promise<ReturnSubcptnPaymentResult> {
    const plant = await this.wastePlantRepository.getWastePlantById(plantId);
    if (!plant) {
      throw new Error("Plant not found.");
    }
    if (!plant.subscriptionPlan) {
      throw new Error("Subscription plan not found for this plant.");
    }
    const subptnPlanData = await this.subscriptionRepository.checkPlanNameExist(
      plant?.subscriptionPlan,
    );
    if (!subptnPlanData || !subptnPlanData._id) {
      throw new Error("Subscription plan not exist.");
    }
    const paymentData =
      await this.subscriptionPaymentRepository.findSubscriptionPayments(
        plantId,
      );
    if (!paymentData) {
      throw new Error("Subscription paymnets not found.");
    }
    const now = new Date();

    let updated = false;
    paymentData.sort((a, b) => {
      const dateA = a.expiredAt ? new Date(a.expiredAt).getTime() : 0;
      const dateB = b.expiredAt ? new Date(b.expiredAt).getTime() : 0;
      return dateB - dateA;
    });
    for (const payment of paymentData) {
      if (
        !updated &&
        payment.status === "InProgress" &&
        payment.inProgressExpiresAt &&
        payment.inProgressExpiresAt < now
      ) {
        payment.status = "Pending";
        payment.inProgressExpiresAt = null;
        await payment.save();
        updated = true;
        break;
      }
    }

    return {
      paymentData: SubscriptionPaymentMapper.mapPopulatedList(
        paymentData ?? [],
      ),
    };
  }
  async retrySubscriptionPayment(
    data: RetrySubPaymntReq,
  ): Promise<RetrySubPaymntRes> {
    const { plantId, planId, amount, subPaymtId } = data;
    const subptnPaymentData =
      await this.subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPaymtId,
      );
    if (!subptnPaymentData) {
      throw new Error("Payment not found.");
    }
    const now = new Date();
    if (
      subptnPaymentData.status === "InProgress" &&
      subptnPaymentData.inProgressExpiresAt &&
      subptnPaymentData.inProgressExpiresAt <= now
    ) {
      subptnPaymentData.status = "Pending";
      subptnPaymentData.inProgressExpiresAt = null;
    }
    if (
      subptnPaymentData.status === "InProgress" &&
      subptnPaymentData.inProgressExpiresAt &&
      subptnPaymentData.inProgressExpiresAt > now
    ) {
      const waitTime = Math.ceil(
        (subptnPaymentData.inProgressExpiresAt.getTime() - now.getTime()) /
          60000,
      );
      throw new Error(
        `Another payment is in progress. Try again in ${waitTime} minutes.`,
      );
    }

    const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const paymentUpdate = {
      amount: amount,
      method: "Razorpay",
      status: "InProgress",
      razorpayOrderId: subptnPaymentData.razorpayOrderId || null,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      refundRequested: false,
      refundStatus: null,
      refundAt: null,
      inProgressExpiresAt: newExpiry,
    };

    const updatedData =
      await this.subscriptionPaymentRepository.updateSubscriptionPaymentById(
        subptnPaymentData._id.toString(),
        paymentUpdate,
      );
    if (!updatedData.razorpayOrderId || !updatedData.planId) {
      throw new Error("Can't update payment");
    }
    return {
      orderId: updatedData.razorpayOrderId,
      amount: updatedData.amount,
      currency: "INR",
      planId: updatedData.planId.toString(),
      inProgressExpiry: updatedData.inProgressExpiresAt
        ? updatedData.inProgressExpiresAt?.toISOString()
        : "",
    };
  }
  async updateRefundStatusPayment(
    data: UpdateStatusReq,
  ): Promise<RefundStatusUpdateResp> {
    const { plantId, statusUpdateData } = data;
    const { pickupReqId, status } = statusUpdateData;
    console.log({ data, statusUpdateData });

    const pickupReq = await this.pickupRepository.getPickupById(pickupReqId);
    console.log("pickupReq", pickupReq);

    if (pickupReq.wasteplantId?.toString() !== plantId) {
      throw new Error("Not belongs in wasteplant.");
    }
    if (pickupReq.payment.status !== "Paid") {
      throw new Error("Payment not completed.");
    }
    if (pickupReq.payment.payoutStatus === "Completed") {
      throw new Error("Refund not allowed after payout settlement.");
    }
    const currentStatus = pickupReq.payment.refundStatus;
    const inProgressExpiresAt = pickupReq.payment.inProgressExpiresAt;
    if (
      currentStatus === "Processing" &&
      inProgressExpiresAt &&
      new Date(inProgressExpiresAt) > new Date()
    ) {
      const expireTime = new Date(inProgressExpiresAt).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        },
      );
      throw new Error(
        `Refund is already being processed. Try again after ${expireTime}.`,
      );
    }
    pickupReq.payment.refundStatus = status;
    if (status === "Processing") {
      pickupReq.payment.inProgressExpiresAt = new Date(
        Date.now() + 5 * 60 * 1000,
      );
    } else {
      pickupReq.payment.inProgressExpiresAt = null;
    }
    await pickupReq.save();
    const userId = pickupReq.userId.toString();
    const userWallet = await this._walletRepository.findWallet(userId, "User");
    if (!userWallet) throw new Error("User wallet not found.");
    const pickupTransaction = userWallet.transactions.find(
      (tx) =>
        tx.pickupReqId?.toString() === pickupReqId.toString() &&
        tx.subType === "PickupPayment",
    );
    if (!pickupTransaction) throw new Error("Pickup transaction not found.");
    if (!pickupTransaction.refundRequested) {
      throw new Error("Refund was not requested.");
    }
    if (!status || !currentStatus) {
      throw new Error("Refund status cannot be null.");
    }
    if (
      (currentStatus === "Pending" &&
        !["Processing", "Rejected"].includes(status)) ||
      (currentStatus === "Processing" && status !== "Refunded") ||
      ["Refunded", "Rejected"].includes(currentStatus)
    ) {
      throw new Error("Invalid refund status transition.");
    }
    pickupTransaction.refundStatus = status;

    await userWallet.save();
    const io = globalThis.io;

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

    if (io) {
      io.to(`${userId}`).emit("newNotification", userNotification);
    }

    return {
      _id: pickupReq._id.toString(),
      refundStatus: pickupReq.payment.refundStatus,
      inProgressExpiresAt: pickupReq.payment.inProgressExpiresAt,
    };
  }
  async refundPayment(plantId: string, data: RefundDataReq) {
    console.log("data",data);
    
    const pickupReq = await this.pickupRepository.getPickupById(
      data.pickupReqId,
    );
    console.log("pickupReq", pickupReq);

    if (pickupReq.wasteplantId?.toString() !== plantId) {
      throw new Error("PickupReq not belongs in this wasteplant.");
    }
    const payment = pickupReq.payment;
    if (!payment) {
      throw new Error("No payment record found.");
    }
    if (payment.refundStatus === "Refunded") {
      throw new Error("Already refunded");
    }

    const accountId = pickupReq.userId.toString();
    const accountType = "User";
    try {
      if (payment.method === "Wallet") {
        const wallet = await this._walletRepository.findWallet(
          accountId,
          accountType,
        );
        if (!wallet) throw new Error("Wallet not found for this user.");
        const pickupTansaction = wallet.transactions.find(
          (tx) =>
            tx.subType === "PickupPayment" &&
            // tx.pickupReqId?.toString() === pickupReq._id.toString() &&
            tx.pickupReqId?.equals(pickupReq._id) &&
            tx.method === "Wallet",
        );
        if (!pickupTansaction) throw new Error("Pickup transaction not found.");
        wallet.holdingBalance -= payment.amount;
        wallet.balance += payment.amount;
        // pickupTansaction.type = "Credit";
        // pickupTansaction.subType = "Refund";
        // pickupTansaction.description = `Refund for Pickup ID ${pickupReq.pickupId}`;
        // pickupTansaction.refundStatus = "Refunded";
        // pickupTansaction.refundAt = new Date();
        wallet.transactions.push({
          type: "Credit",
          subType: "Refund",
          method: "Wallet",
          pickupReqId: pickupReq._id,
          amount: pickupReq.payment.amount,
          description: `Refund for Pickup ID ${pickupReq.pickupId}`,
          refundStatus: "Refunded",
          refundAt: new Date(),
        });

        await wallet.save();

        payment.refundStatus = "Refunded";
        payment.refundAt = new Date();
        payment.walletRefundId = `wallet_refund_${Date.now()}`;

        pickupReq.status = "Cancelled";
        await pickupReq.save();
      } else if (payment.method === "Razorpay") {
        if (
          payment.razorpayPaymentId !== data.razorpayPaymentId ||
          payment.amount !== data.amount
        ) {
          throw new Error("Payment details do not match.");
        }

        const paymentDetails = await this.razorpay.payments.fetch(
          data.razorpayPaymentId,
        );

        if (paymentDetails.status !== "captured") {
          throw new Error("Payment is not captured and cannot be refunded.");
        }

        if (process.env.NODE_ENV === "production") {
          const refund = await this.razorpay.payments.refund(
            data.razorpayPaymentId,
            { amount: paymentDetails.amount, speed: "normal" },
          );
          payment.razorpayRefundId = refund.id;
        } else {
          console.log("Simulating refund success in TEST MODE");
          payment.razorpayRefundId = `test_refund_${Date.now()}`;
        }

        const wallet = await this._walletRepository.findWallet(
          accountId,
          accountType,
        );
        if (!wallet) throw new Error("Wallet not found for this user.");
        console.log("wallet-raz",wallet);
        
        const pickupTansaction = wallet.transactions.find(
          (tx) =>
            tx.subType === "PickupPayment" &&
            // tx.pickupReqId?.toString() === pickupReq._id.toString() &&
            tx.pickupReqId?.equals(pickupReq._id) &&
            tx.method === "Razorpay"
        );
        console.log("pickupTansaction",pickupTansaction);
        
        if (!pickupTansaction) throw new Error("Pickup transaction not found.");
        wallet.holdingBalance -= payment.amount;

        // pickupTansaction.type = "Credit";
        // pickupTansaction.subType = "ExternalRefund";
        // pickupTansaction.description = `Refund via Razorpay for Pickup ${pickupReq.pickupId}`;
        // pickupTansaction.refundStatus = "Refunded";
        // pickupTansaction.refundAt = new Date();
        wallet.transactions.push({
          type: "Credit",
          subType: "ExternalRefund",
          method: "Razorpay",
          pickupReqId: pickupReq._id,
          amount: payment.amount,
          description: `Refund via Razorpay for Pickup ${pickupReq.pickupId}`,
          refundStatus: "Refunded",
          refundAt: new Date(),
        });
        await wallet.save();
        pickupReq.status = "Cancelled";
        payment.refundStatus = "Refunded";
        payment.refundAt = new Date();
        await pickupReq.save();
      } else {
        throw new Error("Unsupported payment method.");
      }

      const io = globalThis.io;
      const userId = pickupReq.userId.toString();
      const userMessage = `Refund processed successfully for Pickup ID ${pickupReq.pickupId}. Amount ₹${payment.amount} has been refunded.`;
      const userNotification =
        await this.notificationRepository.createNotification({
          receiverId: userId,
          receiverType: "user",
          senderId: plantId,
          senderType: "wasteplant",
          message: userMessage,
          type: "pickup_refund-completed",
        });

      if (io) {
        io.to(`${userId}`).emit("newNotification", userNotification);
      }

      return PickupRequestMapper.mapPickupReqDTO(pickupReq);
    } catch (error: any) {
      // console.error("Refund failed:", JSON.stringify(error, null, 2));
      // throw new Error(error?.error?.description || "Refund failed");
        console.error("========== REFUND ERROR ==========");
  console.error("RAW ERROR:", error);
  console.error("MESSAGE:", error?.message);
  console.error("STACK:", error?.stack);
  console.error("==================================");

  throw error; // DO NOT wrap again
    }
    // if (
    //   pickupReq.payment.razorpayPaymentId !== data.razorpayPaymentId ||
    //   pickupReq.payment.amount !== data.amount
    // ) {
    //   throw new Error("Payment details do not match.");
    // }

    // try {
    //   const paymentDetails = await this.razorpay.payments.fetch(
    //     data.razorpayPaymentId,
    //   );
    //   console.log("paymentDetails", paymentDetails);
    //   if (paymentDetails.status !== "captured") {
    //     throw new Error("Payment is not captured and cannot be refunded.");
    //   }
    //   if (process.env.NODE_ENV === "production") {
    //     const refund = await this.razorpay.payments.refund(
    //       data.razorpayPaymentId,
    //       {
    //         amount: paymentDetails.amount,
    //         speed: "normal",
    //       },
    //     );

    //     pickupReq.payment.razorpayRefundId = refund.id;
    //   } else {
    //     console.log("Simulating refund success in TEST MODE");
    //     pickupReq.payment.razorpayRefundId = `test_refund_${Date.now()}`;
    //   }

    //   pickupReq.status = "Cancelled";
    //   pickupReq.payment.refundStatus = "Refunded";
    //   pickupReq.payment.refundAt = new Date();

    //   await pickupReq.save();
    //   const io = globalThis.io;

    //   const userId = pickupReq.userId.toString();
    //   const userMessage = `Refund processed successfully for Pickup ID ${pickupReq.pickupId}. Amount ₹${pickupReq.payment.amount} will be credited soon.`;
    //   const userNotification =
    //     await this.notificationRepository.createNotification({
    //       receiverId: userId,
    //       receiverType: "user",
    //       senderId: plantId,
    //       senderType: "wasteplant",
    //       message: userMessage,
    //       type: "pickup_refund-completed",
    //     });
    //   console.log("userNotification", userNotification);

    //   if (io) {
    //     io.to(`${userId}`).emit("newNotification", userNotification);
    //   }

    //   return PickupRequestMapper.mapPickupReqDTO(pickupReq);
    // } catch (error: any) {
    //   console.error("Refund failed:", JSON.stringify(error, null, 2));
    //   throw new Error(error?.error?.description || "Refund failed");
    // }
  }
}
