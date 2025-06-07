export type PaymentRecord = {
  pickupId: string;
  wasteType: string;
  payment: {
    status: string;
    razorpayPaymentId: string;
    amount: number;
    paidAt: Date;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};