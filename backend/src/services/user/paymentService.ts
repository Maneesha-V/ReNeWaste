import { IPaymentService } from "./interface/IPaymentService";
import PickupRepository from "../../repositories/pickupReq/pickupRepository";
import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const RAZORPAY_KEY = process.env.RAZORPAY_KEY_ID!
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});

class PaymentService implements IPaymentService {
  async createPaymentOrderService(
    amount: number,
    pickupReqId: string,
    userId: string
  ) {
    const pickupRequest =
      await PickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId
      );
    console.log("pickupRequest ", pickupRequest);
    if (!pickupRequest) {
      throw new Error("Pickup request not found for the user.");
    }
    const order = await razorpay.orders.create({
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${pickupRequest.pickupId}_${Date.now().toString().slice(-4)}`,
      notes: {
        pickupReqId,
        userId,
      },
      payment_capture: true,
    });
 pickupRequest.payment = {
    amount,
    method: "Razorpay", 
    status: "Pending", 
    razorpayOrderId: order.id,
    razorpayPaymentId: null,
    razorpaySignature: null,
    paidAt: null,
  };
    await pickupRequest.save();

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      pickupReqId,
    };
  }
  
   async verifyPaymentService(
     {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    pickupReqId,
    amount
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    pickupReqId: string;
    amount: number;
  },
  userId: string
  ) {
 const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid signature. Payment could not be verified.");
  }

  const paymentUpdate = {
    status: "Paid",
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    amount: amount / 100,
    paidAt: new Date(),
  };

  const updatedPickup = await PickupRepository.savePaymentDetails(pickupReqId, paymentUpdate, userId);

  return updatedPickup;
  }
  
  async getAllPaymentsService(userId: string) {
    return await PickupRepository.getAllPaymentsByUser(userId);
  }
  
   async rePaymentService(
    userId: string,
    pickupReqId: string,
    amount: number
  ) {
    const pickupRequest =
      await PickupRepository.getPickupByUserIdAndPickupReqId(
        pickupReqId,
        userId
      );
    console.log("pickupRequest ", pickupRequest);
    if (!pickupRequest) {
      throw new Error("pickupRequest not found.");
    }
 if (!pickupRequest.payment) {
    throw new Error("Payment details not found in the pickup request.");
  }
 pickupRequest.payment = {
    amount: amount * 100,
    method: "Razorpay", 
    status: "Pending", 
    razorpayOrderId: pickupRequest.payment?.razorpayOrderId || null,
    razorpayPaymentId: null,
    razorpaySignature: null,
    paidAt: null,
  };
    await pickupRequest.save();

    return {
    orderId: pickupRequest.payment?.razorpayOrderId,  
    amount: pickupRequest.payment?.amount,
    currency: "INR",  
    pickupReqId,
    };
  }
}
export default new PaymentService();
