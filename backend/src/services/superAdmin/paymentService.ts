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
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";
import mongoose from "mongoose";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor(
    @inject(TYPES.SubscriptionPaymentRepository)
    private _subscriptionPaymentRepository: ISubscriptionPaymentRepository,
    @inject(TYPES.WastePlantRepository)
    private _wastePlantRepository: IWastePlantRepository,
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
    data: PaginationInput,
  ): Promise<SubscriptionPaymentHisResult> {
    const paymentHisData =
      await this._subscriptionPaymentRepository.getAllSubscptnPayments(data);
    if (!paymentHisData) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.PAYMENT_HIS_NOT_FOUND,
      );
    }

    return paymentHisData;
  }
  async updateRefundStatusPayment(
    data: UpdateRefundStatusReq,
  ): Promise<SubscriptionPaymentDTO> {
    const { subPayId, refundStatus, adminId, rejectionMessage } = data;
    console.log(data);

    const payment =
      await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
        subPayId,
      );
    if (!payment) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.PAYMENT_NOT_FOUND,
      );
    }
    console.log("RefundPaym..", payment);
    let currentStatus = payment.refundStatus;
    const inProgressExpiresAt = payment.inProgressExpiresAt;

    if (!refundStatus) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.SUPERADMIN.ERROR.REF_STAT_NOT_NULL,
      );
    }
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
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        `Refund is already being processed. Try again after ${expireTime}.`,
      );
    }
    // if (!currentStatus) {
    //   throw new ApiError(
    //     STATUS_CODES.NOT_FOUND,
    //     MESSAGES.SUPERADMIN.ERROR.CURR_STAT_NOT_NULL,
    //   );
    // }
    // if (
    //   (currentStatus === "Pending" &&
    //     !["Processing", "Rejected"].includes(refundStatus)) ||
    //   (currentStatus === "Processing" && refundStatus !== "Refunded") ||
    //   ["Refunded", "Rejected"].includes(currentStatus)
    // ) {
    //   throw new ApiError(
    //     STATUS_CODES.NOT_FOUND,
    //     MESSAGES.SUPERADMIN.ERROR.INVALID_STAT_TRANSITION,
    //   );
    // }
    if (!currentStatus) {
      // Initial refund status
      if (refundStatus !== "Pending") {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.SUPERADMIN.ERROR.INVALID_STAT_TRANSITION,
        );
      }
    } else {
      // Current status exists, so now currentStatus is a RefundStatus
      if (
        (currentStatus === "Pending" &&
          !["Processing", "Rejected"].includes(refundStatus)) ||
        (currentStatus === "Processing" && refundStatus !== "Refunded") ||
        ["Refunded", "Rejected"].includes(currentStatus)
      ) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.SUPERADMIN.ERROR.INVALID_STAT_TRANSITION,
        );
      }
    }

    payment.refundStatus = refundStatus;

    const plant = await this._wastePlantRepository.getWastePlantById(
      payment.wasteplantId.toString(),
    );
    if (!plant) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
      );
    }
    let plantMessage = "";
    let notificationType = "";

    // if (refundStatus) {
    // if (refundStatus === "Processing") {
    //   payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // } else {
    //   payment.inProgressExpiresAt = null;
    // }
    if (refundStatus === "Rejected") {
      if (!rejectionMessage?.trim()) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          "Rejection message is required.",
        );
      }

      payment.refundRequested = false;
      payment.inProgressExpiresAt = null;
    }
    if (refundStatus === "Processing") {
      payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    }

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
        plantMessage = `Refund has been rejected for ${plant.plantName}. Reason: ${rejectionMessage}. PaymentId: ${payment._id}.`;
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
    // } else {
    //   payment.inProgressExpiresAt = null;
    // }
    await payment.save();

    return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
  }

  // async refundPayment(
  //   data: UpdateRefundStatusReq,
  // ): Promise<SubscriptionPaymentDTO> {
  //   const { subPayId, adminId } = data;

  //   const payment =
  //     await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
  //       subPayId,
  //     );
  //   if (!payment) {
  //     throw new ApiError(
  //       STATUS_CODES.NOT_FOUND,
  //       MESSAGES.SUPERADMIN.ERROR.PAYMENT_NOT_FOUND,
  //     );
  //   }

  //   if (payment.refundStatus === "Refunded") {
  //     throw new ApiError(
  //       STATUS_CODES.CONFLICT,
  //       MESSAGES.SUPERADMIN.ERROR.PAYMENT_ALREADY_REF,
  //     );
  //   }

  //   if (!payment.razorpayPaymentId) {
  //     throw new ApiError(
  //       STATUS_CODES.BAD_REQUEST,
  //       MESSAGES.SUPERADMIN.ERROR.PAYMENT_ID_MISS,
  //     );
  //   }

  //   payment.inProgressExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  //   await payment.save();

  //   try {
  //     const paymentDetails = await this.razorpay.payments.fetch(
  //       payment.razorpayPaymentId,
  //     );

  //     if (paymentDetails.status !== "captured") {
  //       throw new ApiError(
  //         STATUS_CODES.BAD_REQUEST,
  //         MESSAGES.SUPERADMIN.ERROR.PAYMENT_NOT_CAPTURE,
  //       );
  //     }

  //     let refundId: string;

  //     if (process.env.NODE_ENV === "production") {
  //       const refund = await this.razorpay.payments.refund(
  //         payment.razorpayPaymentId,
  //         {
  //           amount: paymentDetails.amount,
  //           speed: "normal",
  //         },
  //       );
  //       refundId = refund.id;
  //     } else {
  //       refundId = `test_refund_${Date.now()}`;
  //       console.log("Simulated refund in test mode");
  //     }

  //     const plant = await this._wastePlantRepository.getWastePlantById(
  //       payment.wasteplantId.toString(),
  //     );
  //     if (!plant) {
  //       throw new ApiError(
  //         STATUS_CODES.NOT_FOUND,
  //         MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
  //       );
  //     }

  //     const accountId = payment.wasteplantId.toString();
  //     let wastePlantWallet = await this._walletRepository.findWallet(
  //       accountId,
  //       "WastePlant",
  //     );

  //     if (!wastePlantWallet) {
  //       wastePlantWallet = await this._walletRepository.createWallet({
  //         accountId,
  //         accountType: "WastePlant",
  //       });
  //     }

  //     wastePlantWallet.balance += payment.amount;
  //     wastePlantWallet.transactions.push({
  //       type: "Credit",
  //       subType: "Refund",
  //       amount: payment.amount,
  //       description: `Refunded subscription payment of wasteplant ${plant?.plantName}`,
  //       refundAt: new Date(),
  //       refundStatus: "Refunded",
  //     });

  //     await wastePlantWallet.save();
  //     let adminWallet = await this._walletRepository.findWallet(
  //       adminId,
  //       "SuperAdmin",
  //     );
  //     if (!adminWallet) {
  //       throw new ApiError(
  //         STATUS_CODES.NOT_FOUND,
  //         MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
  //       );
  //     }
  //     payment.razorpayRefundId = refundId;
  //     payment.refundStatus = "Refunded";
  //     payment.refundAt = new Date();
  //     payment.inProgressExpiresAt = null;

  //     await payment.save();

  //     if (plant) {
  //       plant.status = "Inactive";
  //       await plant.save();

  //       await sendNotification({
  //         receiverId: plant._id.toString(),
  //         receiverType: plant.role,
  //         senderId: adminId,
  //         senderType: "superadmin",
  //         message: `Refund completed for ${plant.plantName}.`,
  //         type: "subscriptn-refund-completed",
  //       });
  //     }

  //     return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
  //   } catch (error: unknown) {
  //     payment.inProgressExpiresAt = null;
  //     await payment.save();
  //     throw error;
  //   }
  // }
  async refundPayment(
    data: UpdateRefundStatusReq,
  ): Promise<SubscriptionPaymentDTO> {
    const { subPayId, adminId } = data;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const payment =
        await this._subscriptionPaymentRepository.findSubscriptionPaymentById(
          subPayId,
          session,
        );
      console.log({ payment });

      if (!payment) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.SUPERADMIN.ERROR.PAYMENT_NOT_FOUND,
        );
      }

      if (payment.refundStatus === "Refunded") {
        throw new ApiError(
          STATUS_CODES.CONFLICT,
          MESSAGES.SUPERADMIN.ERROR.PAYMENT_ALREADY_REF,
        );
      }

      if (!payment.razorpayPaymentId) {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.SUPERADMIN.ERROR.PAYMENT_ID_MISS,
        );
      }

      // 1. Call Razorpay
      const paymentDetails = await this.razorpay.payments.fetch(
        payment.razorpayPaymentId,
      );
      console.log({ paymentDetails });

      if (paymentDetails.status !== "captured") {
        throw new ApiError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.SUPERADMIN.ERROR.PAYMENT_NOT_CAPTURE,
        );
      }

      let refundId: string;

      // if (process.env.NODE_ENV === "production") {
      //   const refund = await this.razorpay.payments.refund(
      //     payment.razorpayPaymentId,
      //     {
      //       amount: paymentDetails.amount,
      //       speed: "normal",
      //     },
      //   );

      //   refundId = refund.id;
      // } else {
      //   refundId = `test_refund_${Date.now()}`;
      // }
      refundId = `test_refund_${Date.now()}`;
      console.log({ refundId });

      // 2. Get plant
      const plant = await this._wastePlantRepository.getWastePlantById(
        payment.wasteplantId.toString(),
        session,
      );
      console.log({ plant });

      if (!plant) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.WASTEPLANT.ERROR.NOT_FOUND,
        );
      }

      // 3. Get/create wallet
      let wastePlantWallet = await this._walletRepository.findWallet(
        payment.wasteplantId.toString(),
        "WastePlant",
        session,
      );

      if (!wastePlantWallet) {
        wastePlantWallet = await this._walletRepository.createWallet(
          {
            accountId: payment.wasteplantId.toString(),
            accountType: "WastePlant",
          },
          session,
        );
      }

      // 4. Update wallet
      wastePlantWallet.balance += payment.amount;

      wastePlantWallet.transactions.push({
        type: "Credit",
        subType: "Refund",
        amount: payment.amount,
        description: `Refunded subscription payment of wasteplant ${plant.plantName}`,
        refundAt: new Date(),
        refundStatus: "Refunded",
      });

      await wastePlantWallet.save({ session });

      // 5. Verify admin wallet
      const adminWallet = await this._walletRepository.findWallet(
        adminId,
        "SuperAdmin",
        session,
      );

      if (!adminWallet) {
        throw new ApiError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
        );
      }

      // 6. Update payment
      payment.razorpayRefundId = refundId;
      payment.refundStatus = "Refunded";
      payment.refundAt = new Date();
      payment.inProgressExpiresAt = null;
      payment.refundRequested = false;
      await payment.save({ session });

      // 7. Update plant
      plant.status = "Inactive";

      await plant.save({ session });

      // 8. Commit ALL DB changes
      await session.commitTransaction();

      // 9. Notification AFTER commit
      await sendNotification({
        receiverId: plant._id.toString(),
        receiverType: plant.role,
        senderId: adminId,
        senderType: "superadmin",
        message: `Refund completed for ${plant.plantName}.`,
        type: "subscriptn-refund-completed",
      });

      return SubscriptionPaymentMapper.mapSubscptnPaymentDTO(payment);
    } catch (error: unknown) {
      // Rollback MongoDB changes
      await session.abortTransaction();

      // IMPORTANT:
      // Don't destroy the original error
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
