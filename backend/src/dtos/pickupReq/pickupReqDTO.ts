import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";
import { IPayment } from "../../models/pickupRequests/interfaces/paymentInterface";
import { Address, IPickupRequestDocument } from "../../models/pickupRequests/interfaces/pickupInterface";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { IUserDocument } from "../../models/user/interfaces/userInterface";
import { BaseDTO } from "../base/BaseDTO";

export interface PickupReqDTO extends BaseDTO {
  userId: string;
  driverId?: string;
  wasteplantId?: string;
  truckId?: string;
  addressId: string;
  wasteType: "Residential" | "Commercial";
  originalPickupDate: Date;
  rescheduledPickupDate?: Date;
  pickupTime: string;
  pickupId: string;
  businessName?: string;
  service?: string;
  frequency?: string;
  status: string;
  trackingStatus?:
    | "Assigned"
    | "InTransit"
    | "Near"
    | "Arrived"
    | "Completed"
    | null;
  eta?: {
    text: string | null;
    value: number | null;
  };
  payment: PaymentDTO;
}
export interface PaymentDTO {
  status: "Pending" | "InProgress" | "Paid" | "Failed";
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  refundRequested: boolean;
  refundStatus: "Pending" | "Processing" | "Refunded" | "Rejected" | null;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
}
export interface PickupPaymentSummaryDTO {
  _id: string;
  pickupId: string;
  originalPickupDate: Date;
  rescheduledPickupDate?: Date;
  wasteType: string;
  status: string;
  payment: {
    status: string;
    amount: number;
    method: string;
    paidAt: Date | null;
    refundStatus: "Pending" | "Processing" | "Refunded" | "Rejected" | null; 
    razorpayOrderId: string | null;
    refundRequested: boolean;
    refundAt: Date | null;
  };
}
export interface PopulatedPIckupPlans extends Omit<IPickupRequestDocument, 'driverId' | 'truckId' > {
  user: IUserDocument;
  driverId?: IDriverDocument;
  truckId?: ITruckDocument;
  address: Address;
}
export interface PickupPlansDTO {
  _id: string;
  pickupId: string;
  wasteType: string;
  originalPickupDate: string;
  rescheduledPickupDate?: string;
  pickupTime: string;
  status: string;
  trackingStatus?: string | null;
  eta?: {
    text: string | null;
    value: number | null;
  };
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  userId: string;
  driverId?: {
    name: string;
    contact: string;
    _id: string;
  };
  truckId?: {
    name: string;
    vehicleNumber: string;
    _id: string;
  };
  wasteplantId: string;
  addressId: string;
  address: Address;
  payment: IPayment;
}