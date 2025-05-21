import { IPickupRequest, IPickupRequestDocument } from "../../../models/pickupRequests/interfaces/pickupInterface";

export interface IPaymentService {
  createPaymentOrderService(
    amount: number,
    pickupReqId: string,
    userId: string
  ): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    pickupReqId: string;
  }>;

  verifyPaymentService(
    paymentDetails: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      pickupReqId: string;
      amount: number;
    },
    userId: string
  ): Promise<IPickupRequestDocument>;

  getAllPaymentsService(userId: string): Promise<Partial<IPickupRequest>[]>;

  rePaymentService(
    userId: string,
    pickupReqId: string,
    amount: number
  ): Promise<{
    orderId: string | null;
    amount: number | null;
    currency: string;
    pickupReqId: string;
  }>;
}