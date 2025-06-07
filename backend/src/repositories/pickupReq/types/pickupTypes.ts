export type WasteType = "Residential" | "Commercial";

export type PickupStatus =
  | "Pending"
  | "Scheduled"
  | "Rescheduled"
  | "Completed"
  | "Cancelled";
export type StatusCounts = Record<PickupStatus | "Active", number>;

export type PickupStatusByWasteType = Record<WasteType, StatusCounts>;

export type RevenueByWasteType = {
  totalResidentialRevenue: number;
  totalCommercialRevenue: number;
  totalRevenue: number;
};
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
