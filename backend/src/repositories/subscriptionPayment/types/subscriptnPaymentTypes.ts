export type CreateSubsptnPaymentPayload = {
  plantId: string,
  planId: string,
  amount: number,
  paymentDetails: {
    method: string;
    status: string;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    razorpaySignature: string | null;
    paidAt: Date | null;
    refundRequested: boolean;
    refundStatus: string | null;
    refundAt: Date | null;
  }
}