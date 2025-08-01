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
} from "../../dtos/pickupReq/paymentDTO";
import { PickupPaymentSummaryDTO } from "../../dtos/pickupReq/pickupReqDTO";
import { PickupRequestMapper } from "../../mappers/PIckupReqMapper";

@injectable()
export class PaymentService implements IPaymentService {
  private razorpay: Razorpay;
  constructor(
    @inject(TYPES.PickupRepository)
    private pickupRepository: IPickupRepository
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
  async createPaymentOrderService(
    data: CreatePaymentReq
  ): Promise<CreatePaymentResp> {
    const { pickupReqId, userId, amount } = data;
    const pickupRequest =
      await this.pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId
      );
    console.log("pickupRequest ", pickupRequest);
    if (!pickupRequest) {
      throw new Error("Pickup request not found for the user.");
    }

    //  pickupRequest.payment = {
    //   amount,
    //   method: "Razorpay",
    //   status: "Pending",
    //   razorpayOrderId: null,
    //   razorpayPaymentId: null,
    //   razorpaySignature: null,
    //   paidAt: null,
    //   refundRequested: false,
    //   refundStatus: null,
    //   refundAt: null,
    //   razorpayRefundId: null,
    //   inProgressExpiresAt: null,
    // };
    const now = new Date();
    const payment = pickupRequest.payment;
    if (
      payment?.status === "InProgress" &&
      payment.inProgressExpiresAt &&
      payment.inProgressExpiresAt > now
    ) {
      throw new Error(
        "A payment is already in progress. Please wait a few minutes before retrying."
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
    pickupRequest.payment = {
      amount,
      method: "Razorpay",
      status: "InProgress",
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      paidAt: null,
      refundRequested: false,
      refundStatus: null,
      refundAt: null,
      razorpayRefundId: null,
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
    data: VerifyPaymentReq
  ): Promise<VerifyPaymentResp> {
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
      throw new Error("Invalid signature. Payment could not be verified.");
    }
    const pickupRequest =
      await this.pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId
      );

    if (!pickupRequest) {
      throw new Error("pickupRequest not found.");
    }
    const payment = pickupRequest.payment;

    if (!payment) {
      throw new Error("Payment details not found in the pickup request.");
    }
    // payment.status = "Paid";
    // payment.razorpayOrderId = razorpay_order_id;
    // payment.razorpayPaymentId = razorpay_payment_id;
    // payment.razorpaySignature = razorpay_signature;
    // payment.amount = amount;
    // payment.paidAt = new Date();
    pickupRequest.payment = {
      ...pickupRequest.payment,
      amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paidAt: new Date(),
      status: "Paid",
    };
    pickupRequest.markModified("payment");
    await pickupRequest.save();
    console.log("✅ Saved payment status:", pickupRequest.payment);
    return PickupRequestMapper.toPaymentDTO(pickupRequest);

    // const paymentUpdate = {
    //   status: "Paid",
    //   razorpayOrderId: razorpay_order_id,
    //   razorpayPaymentId: razorpay_payment_id,
    //   razorpaySignature: razorpay_signature,
    //   amount: amount,
    //   paidAt: new Date(),
    // };

    // const updatedPickup = await this.pickupRepository.savePaymentDetails({
    //   pickupReqId,
    //   paymentData: paymentUpdate,
    //   userId
    // });

    // return updatedPickup;
  }

  async getAllPaymentsService(
    userId: string
  ): Promise<PickupPaymentSummaryDTO[]> {
    const pickups = await this.pickupRepository.getAllPaymentsByUser(userId);
    return pickups.map((p) => PickupRequestMapper.toSummaryDTO(p));
  }

  async rePaymentService(userId: string, pickupReqId: string, amount: number) {
    const pickupRequest =
      await this.pickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId
      );
    console.log("pickupRequest ", pickupRequest);
    if (!pickupRequest) {
      throw new Error("pickupRequest not found.");
    }
    const payment = pickupRequest.payment;

    if (!payment) {
      throw new Error("Payment details not found in the pickup request.");
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
      throw new Error(
        "A payment is already in progress. Please wait a few minutes before retrying."
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
    // pickupRequest.payment = {
    //   amount: amount,
    //   method: "Razorpay",
    //   status: "InProgress",
    //   razorpayOrderId: pickupRequest.payment?.razorpayOrderId || null,
    //   razorpayPaymentId: null,
    //   razorpaySignature: null,
    //   paidAt: null,
    //   refundRequested: false,
    //   refundStatus: null,
    //   refundAt: null,
    //   razorpayRefundId: null,
    //   inProgressExpiresAt: null
    // };
    // await pickupRequest.save();

    // return {
    //   orderId: pickupRequest.payment?.razorpayOrderId,
    //   amount: pickupRequest.payment?.amount,
    //   currency: "INR",
    //   pickupReqId,
    //   expiresAt: payment.inProgressExpiresAt,
    // };
  }
}
