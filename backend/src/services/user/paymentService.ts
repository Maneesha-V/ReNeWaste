import Razorpay from "razorpay";
import crypto from "crypto";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/types";
import { IPickupRepository } from "../../repositories/pickupReq/interface/IPickupRepository";
import { IPaymentService } from "./interface/IPaymentService";
import {
  CreatePaymentReq,
  CreatePaymentResp,
  VerifyPaymentReq,
  VerifyPaymentResp,
  VerifyWalletPickupPaymentReq,
} from "../../dtos/pickupReq/paymentDTO";
import { PickupPaymentSummaryDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";
import { PaginationInput } from "../../dtos/common/commonDTO";
import { IWalletRepository } from "../../repositories/wallet/interface/IWalletRepository";
import { IUserRepository } from "../../repositories/user/interface/IUserRepository";
import PDFDocument from "pdfkit";
import { ApiError } from "../../utils/ApiError";
import { MESSAGES, STATUS_CODES } from "../../utils/constantUtils";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor(
    @inject(TYPES.PickupRepository)
    private _pickupRepository: IPickupRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
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
  async createPaymentOrderService(
    data: CreatePaymentReq,
  ): Promise<CreatePaymentResp> {
    const { pickupReqId, userId, amount, method } = data;
    const pickupRequest =
      await this._pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId,
      );

    if (!pickupRequest) {
      throw new Error("Pickup request not found for the user.");
    }

    const now = new Date();
    const payment = pickupRequest.payment;
    if (payment?.inProgressExpiresAt && payment?.inProgressExpiresAt > now) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS,
      );
    }
    const order = await this.razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${pickupRequest.pickupId}_${Date.now()
        .toString()
        .slice(-4)}`,
      notes: {
        pickupReqId,
        userId,
      },
      payment_capture: true,
    });

    const fetchedOrder = await this.razorpay.orders.fetch(order.id);

    pickupRequest.payment = {
      ...pickupRequest.payment,
      amount,
      method,
      status: "Pending",
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      inProgressExpiresAt: new Date(now.getTime() + 5 * 60 * 1000),
    };
    await pickupRequest.save();

    return {
      orderId: order.id,
      amount: pickupRequest.payment.amount,
      currency: order.currency,
      pickupReqId,
      expiresAt: pickupRequest.payment.inProgressExpiresAt!.toISOString(),
    };
  }

  async verifyPaymentService(
    data: VerifyPaymentReq,
  ): Promise<VerifyPaymentResp> {
    console.log("data", data);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      pickupReqId,
      amount,
      userId,
    } = data;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMMON.ERROR.INVALID_SIGNATURE,
      );
    }
    const pickupRequest =
      await this._pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId,
      );

    if (!pickupRequest) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PICKUP_NOT_FOUND,
      );
    }
    const payment = pickupRequest.payment;

    if (!payment) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PAYMENT_NOT_FOUND,
      );
    }
    if (payment.status === "Paid") {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.PAYMENT_COMPLETE,
      );
    }

    if (payment.amount !== amount) {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.PAYMENT_MISMATCH,
      );
    }
    pickupRequest.payment = {
      ...pickupRequest.payment,
      amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
      status: "Paid",
      payoutStatus: "Pending",
      payoutAt: null,
    };
    pickupRequest.markModified("payment");
    await pickupRequest.save();

    const accountId = userId;
    const accountType = "User";

    let wallet = await this._walletRepository.findWallet(
      accountId,
      accountType,
    );

    if (!wallet) {
      try {
        wallet = await this._walletRepository.createWallet({
          accountId,
          accountType,
        });
      } catch (err) {
        console.error("Wallet creation error", err);
        wallet = await this._walletRepository.findWallet(
          accountId,
          accountType,
        );
      }
    }

    if (!wallet) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMMON.ERROR.WALLET_CREATION_FAILED,
      );
    }

    wallet.holdingBalance += amount;

    wallet.transactions.push({
      amount,
      description: `Pickup payment for request ${pickupRequest.pickupId}`,
      type: "Debit",
      subType: "PickupPayment",
      pickupReqId: pickupRequest._id,
      settlementStatus: "Pending",
      status: "Paid",
      method: "Razorpay",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
    });

    await wallet.save();

    return PickupRequestMapper.toPaymentDTO(pickupRequest);
  }

  async getAllPayments(
    userId: string,
    paginationData: PaginationInput,
  ): Promise<{ payments: PickupPaymentSummaryDTO[]; total: number }> {
    const { pickups, total } =
      await this._pickupRepository.getAllPaymentsByUser(userId, paginationData);
    const payments = pickups.map((p) => PickupRequestMapper.toSummaryDTO(p));
    return { payments, total };
  }

  async rePaymentService(userId: string, pickupReqId: string, amount: number) {
    const pickupRequest =
      await this._pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId,
      );
    console.log("pickupRequest ", pickupRequest);
    if (!pickupRequest) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PICKUP_NOT_FOUND,
      );
    }
    const payment = pickupRequest.payment;

    if (!payment) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PAYMENT_NOT_FOUND,
      );
    }

    const now = new Date();
    if (
      payment.status === "InProgress" &&
      payment.inProgressExpiresAt &&
      payment.inProgressExpiresAt <= now
    ) {
      payment.status = "Pending";
      payment.inProgressExpiresAt = null;
    }
    if (
      payment.status === "InProgress" &&
      payment.inProgressExpiresAt &&
      payment.inProgressExpiresAt > now
    ) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS,
      );
    }
    const expiresIn = 5 * 60 * 1000;
    payment.status = "InProgress";
    payment.inProgressExpiresAt = new Date(now.getTime() + expiresIn);
    payment.amount = amount;
    payment.razorpayOrderId = payment.razorpayOrderId || null;
    payment.razorpayPaymentId = null;
    payment.razorpaySignature = null;
    payment.paidAt = null;
    payment.refundRequested = false;
    payment.refundStatus = null;
    payment.refundAt = null;
    payment.razorpayRefundId = null;

    await pickupRequest.save();

    return {
      orderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: "INR",
      pickupReqId,
      expiresAt: payment.inProgressExpiresAt?.toISOString(),
    };
  }
  async verifyWalletPickupPayment(
    userId: string,
    paymentData: VerifyWalletPickupPaymentReq,
  ): Promise<VerifyPaymentResp> {
    const { pickupReqId, amount, method } = paymentData;
    const accountId = userId;
    const accountType = "User";
    const pickupRequest =
      await this._pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId,
      );

    if (!pickupRequest) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PICKUP_NOT_FOUND,
      );
    }
    if (pickupRequest.payment?.status === "Paid") {
      throw new ApiError(
        STATUS_CODES.SERVER_ERROR,
        MESSAGES.USER.ERROR.PAYMENT_COMPLETE,
      );
    }

    if (!pickupRequest.payment) {
      pickupRequest.payment = {
        status: "Pending",
        method,
        amount,
        paidAt: null,
        payoutStatus: "Pending",
        payoutAt: null,
        inProgressExpiresAt: null,
        razorpayOrderId: null,
        razorpayPaymentId: null,
        razorpaySignature: null,
        refundRequested: false,
        refundStatus: null,
        refundAt: null,
        razorpayRefundId: null,
        walletOrderId: null,
        walletRefundId: null,
      };
    }

    const now = new Date();

    const payment = pickupRequest.payment;

    if (payment.inProgressExpiresAt && payment.inProgressExpiresAt > now) {
      throw new ApiError(
        STATUS_CODES.CONFLICT,
        MESSAGES.COMMON.ERROR.PAYMENT_IN_PROGRESS,
      );
    }

    const wallet = await this._walletRepository.findWallet(
      accountId,
      accountType,
    );
    if (!wallet) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMMON.ERROR.WALLET_NOT_FOUND,
      );
    }
    if (wallet.balance < amount) {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMMON.ERROR.INSUFFICIENT_BAL,
      );
    }
    wallet.balance -= amount;
    wallet.holdingBalance += amount;
    wallet.transactions.push({
      amount,
      description: `Pickup payment for request ${pickupRequest.pickupId}`,
      type: "Debit",
      subType: "PickupPayment",
      pickupReqId: pickupRequest._id,
      paidAt: new Date(),
      status: "Paid",
      settlementStatus: "Pending",
      method: "Wallet",
    });

    await wallet.save();
    const walletOrderId = `wallet_${pickupRequest.pickupId}_${Date.now()
      .toString()
      .slice(-6)}`;
    console.log("walletOrderId", walletOrderId);

    payment.status = "Paid";
    payment.method = method;
    payment.paidAt = new Date();
    payment.inProgressExpiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    payment.walletOrderId = walletOrderId;

    pickupRequest.markModified("payment");

    await pickupRequest.save();

    return PickupRequestMapper.toPaymentDTO(pickupRequest);
  }
  async generateReceipt(pickupReqId: string) {
    const pickup = await this._pickupRepository.getPickupById(pickupReqId);
    if (!pickup) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PICKUP_NOT_FOUND,
      );
    }
    if (!pickup.payment) {
      throw new ApiError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.USER.ERROR.PAYMENT_NOT_FOUND,
      );
    }
    const user = await this._userRepository.findUserById(
      pickup.userId.toString(),
    );
    if (!user) {
      throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.USER.ERROR.NOT_FOUND);
    }
    const payment = pickup.payment;

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });
    doc
      .fillColor("#16a34a")
      .fontSize(24)
      .text("ReNeWaste", { align: "center" });

    doc
      .moveDown()
      .fillColor("black")
      .fontSize(18)
      .text("Waste Collection Receipt", {
        align: "center",
      });

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Receipt No : REC-${pickup.pickupId}`);
    doc.text(`Payment ID : ${payment.razorpayPaymentId}`);
    doc.text(`Order ID   : ${payment.razorpayOrderId}`);
    doc.text(`Date       : ${new Date(payment.paidAt!).toLocaleString()}`);

    doc.moveDown();

    doc.fontSize(16).text("Customer Details");

    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Name  : ${user.firstName} ${user.lastName}`);
    doc.text(`Email : ${user.email}`);

    doc.moveDown();
    doc.fontSize(16).text("Service Details");

    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Service     : ${pickup.wasteType} Service`);
    doc.text(`Waste Type  : ${pickup.wasteType}`);
    const pickupDate =
      pickup.rescheduledPickupDate || pickup.originalPickupDate;
    doc.text(`Pickup Date : ${new Date(pickupDate).toLocaleString()}`);
    doc.text(`Pickup Time : ${pickup.pickupTime}`);

    doc.moveDown();

    doc.fontSize(16).text("Payment Details");

    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Amount Paid : ₹${payment.amount}`);
    doc.text(`Status      : ${payment.status}`);
    doc.text(`Method      : ${payment.method}`);

    doc.moveDown(3);
    doc
      .fillColor("#16a34a")
      .fontSize(13)
      .text("Thank you for choosing ReNeWaste!", {
        align: "center",
      });

    doc
      .fillColor("gray")
      .fontSize(11)
      .text("Together, let's build a cleaner tomorrow.", {
        align: "center",
      });

    return {
      doc,
      pickupId: pickup.pickupId,
    };
  }
}
