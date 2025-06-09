export type PaymentRecord = {
  _id: string;
  pickupId: string;
  wasteType: string;
  payment: {
    status: string;
    razorpayPaymentId: string;
    amount: number;
    paidAt: Date;
    refundRequested?: boolean;
    refundStatus?: "Pending" | "Refunded" | "Rejected" | null;
    refundAt: Date;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};