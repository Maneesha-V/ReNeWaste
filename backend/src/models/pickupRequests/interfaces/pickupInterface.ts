import mongoose, { Document, Types } from "mongoose";
import { IPayment } from "./paymentInterface";
import { IDriverDocument } from "../../driver/interfaces/driverInterface";
import { ITruckDocument } from "../../truck/interfaces/truckInterface";

export interface IPickupRequest extends Document {
  userId: mongoose.Types.ObjectId;
  driverId?: mongoose.Types.ObjectId;
  wasteplantId?: mongoose.Types.ObjectId;
  truckId?: mongoose.Types.ObjectId;
  addressId: mongoose.Types.ObjectId;
  wasteType: "Residential" | "Commercial";
  originalPickupDate: Date;
  rescheduledPickupDate?: Date;
  pickupTime: string;
  pickupId: string;
  businessName?: string;
  service?: string;
  frequency?: string;
  parentRequestId?: mongoose.Types.ObjectId;
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
  isPaused?: boolean;
  pauseUntil?: Date | null;
  requestedFrequency? : string | null;
  requestType?: string | null;
  payment: IPayment;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPickupRequestDocument extends IPickupRequest, Document {
  _id: Types.ObjectId;
}

export interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  taluk: string;
  location: string;
  state: string;
  pincode: string;
  district: string;
  latitude?: number | null;
  longitude?: number | null;
}
export interface PopulatedUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  addresses: Address[];
}

export type PopulatedPickup = Omit<IPickupRequestDocument, "userId"> & {
  userId: PopulatedUser;
};

export type CheckExistingBusinessReq = {
  userId: string;
  frequency: string;
  businessName: string;
  wasteType: string;
};
export type CheckExistingResidReq = {
  userId: string;
  wasteType: string;
  pickupDate: string;
};
export type CheckExistingBusinessResp = {
  type: string;
  data: IPickupRequestDocument;
};
export type FindDriverPlantTruckByIdReq = {
  truckId: string;
  plantId: string;
  driverId: string;
}
export type PickupDriverFilterParamsRepo = {
  driverId: string;
};
export type PickupStatusRepo =
  | "Pending"
  | "Scheduled"
  | "Rescheduled"
  | "Completed"
  | "Cancelled";

  export type WasteTypeRepo = "Residential" | "Commercial";

  export type StatusCounts = Record<PickupStatusRepo | "Active", number>;
  
  export type PickupStatusByWasteTypeRepo = Record<WasteTypeRepo, StatusCounts>;
  export interface PopulatedPIckupPlansRepo
    extends Omit<IPickupRequestDocument, "driverId" | "truckId" | "__v"> {
    user: {
      firstName: string;
      lastName: string;
      phone: string;
    };
    driverId?: IDriverDocument;
    truckId?: ITruckDocument;
    address: Address;
  }

  export interface PopulatedUserPickupReqRepo  {
    _id: string | Types.ObjectId;
   userId: {
      _id: string;
      addresses: Address[];
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
    isPaused?: boolean;
    pauseUntil?: Date | null;
    requestedFrequency? : string | null;
    requestType?: string | null;
    payment: PaymentRepo;
  }
  export interface PaymentRepo {
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
  export type FilterReportRepo = {
  from: string;
  to: string;
  plantId: string;
};
export type PickupFilterParamsRepo = {
  status?: string;
  wasteType?: string;
  plantId: string;
};
export type FetchWPDashboardRepo = {
    filter: string;
    plantId: string;
    from: string;
    to: string;
  }
   export interface PickupTrendResultRepo {
  date: string;
  totalPickups: number;
  residential: number;
  commercial: number;
}
export interface modCommPickData {
  pickupReqId: string;
  requestType: string;
  pauseUntil: Date;
  newFrequency: string;
  reason: string;
}