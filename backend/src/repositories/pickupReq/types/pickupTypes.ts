export type WasteType = "Residential" | "Commercial";

export type PickupStatus =
  | "Pending"
  | "Scheduled"
  | "Rescheduled"
  | "Completed"
  | "Cancelled";
export type StatusCounts = Record<PickupStatus | "Active", number>;

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
    refundStatus?: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
    refundAt?: Date;
    inProgressExpiresAt: Date;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};
