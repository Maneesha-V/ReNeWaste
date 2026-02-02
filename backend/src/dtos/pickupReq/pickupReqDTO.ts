import { Types } from "mongoose";
import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";
import { IPayment } from "../../models/pickupRequests/interfaces/paymentInterface";
import {
  Address,
  IPickupRequest,
  IPickupRequestDocument,
} from "../../models/pickupRequests/interfaces/pickupInterface";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { IUserDocument } from "../../models/user/interfaces/userInterface";
import { BaseDTO } from "../base/BaseDTO";
import { AddressDTO } from "../user/userDTO";

// export type PIckupReqStatus = "Pending" | "Scheduled" | "Completed"| "Cancelled" | "Rescheduled"
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
  parentRequestId?: string;
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
  completedAt?: Date | null;
  payment: PaymentDTO;
}
export interface IPickupRequestExtDocument
  extends Omit<IPickupRequest, "userId" | "driverId" | "truckId">,
    Document {
  _id: Types.ObjectId;

  userId: {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    addresses: {
      addressLine1: string;
      addressLine2?: string;
      taluk: string;
      location: string;
      state: string;
      pincode: string;
      district: string;
      latitude?: number | null;
      longitude?: number | null;
      _id: Types.ObjectId;
    }[];
  };

  driverId?: {
    _id: Types.ObjectId;
    name: string;
    contact: string;
  } | null;

  truckId?: {
    _id: Types.ObjectId;
    number: string;
    capacity: number;
  } | null;

  // wasteplantId?: {
  //   _id: Types.ObjectId;
  //   businessName: string;
  //   frequency: string;
  //   service: string;
  // } | null;
}

export interface PickupReqGetDTO extends BaseDTO {
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  driverId?: string;
  wasteplantId?: string;
  truckId?: string;
  addressId: string;
  wasteType: string;
  originalPickupDate: Date;
  rescheduledPickupDate?: Date;
  pickupTime: string;
  pickupId: string;
  businessName?: string;
  service?: string;
  frequency?: string;
  parentRequestId?: string;
  status: string;
  trackingStatus?: string | null;
  eta?: {
    text: string | null;
    value: number | null;
  };
  payment: PaymentDTO;
  userName: string;
  userAddress?: Address;
  location?: string;
}
export interface PopulatedUserPickupReq extends BaseDTO {
 userId: {
    _id: string;
    addresses: AddressDTO[];
  };
  driverId?: string;
  wasteplantId?: string;
  truckId?: string;
  addressId: string;
  wasteType: string;
  originalPickupDate: Date;
  rescheduledPickupDate?: Date;
  pickupTime: string;
  pickupId: string;
  businessName?: string;
  service?: string;
  frequency?: string;
  parentRequestId?: string;
  status: string;
  trackingStatus?: string | null;
  eta?: {
    text: string | null;
    value: number | null;
  };
  completedAt: Date;
  payment: PaymentDTO;
}
export interface PaymentDTO {
  status: string;
  method: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  amount: number;
  paidAt: Date | null;
  refundRequested: boolean;
  refundStatus: string | null;
  refundAt: Date | null;
  razorpayRefundId: string | null;
  inProgressExpiresAt: Date | null;
  walletOrderId?: string | null;
  walletRefundId?: string | null;
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
    walletOrderId?: string | null;
    walletRefundId?: string | null;
  };
}
export interface PopulatedPIckupPlans
  extends Omit<IPickupRequestDocument, "driverId" | "truckId" | "__v"> {
  // user: IUserDocument;
  user: {
    firstName: string;
    lastName: string;
    phone: string;
  };
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
  address: Address | null;
  payment: IPayment;
}

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
export type PickupDriverFilterParams = {
  // wasteType?: string;
  driverId: string;
};
export type CheckExistingBusinessReq = {
  userId: string;
  frequency: string;
  businessName: string;
  wasteType: string;
};
export type CheckExistingBusinessResp = {
  type: string;
  data: IPickupRequestDocument;
};
export type CheckExistingResidReq = {
  userId: string;
  wasteType: string;
  pickupDate: string;
};
export type cancelPickupReasonData = {
  userId: string;
  pickupReqId: string;
  reason: string;
};
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
    walletOrderId?: string | null;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};
export type FindDriverPlantTruckByIdReq = {
  truckId: string;
  plantId: string;
  driverId: string;
}
