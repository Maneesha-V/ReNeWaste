import { Address } from "../user/userTypes";
import { PickupReqPayment } from "./paymentTypes";

export interface PickupPlansResp {
  _id: string;
  pickupId: string;
  wasteType: string;
  originalPickupDate: string;
  rescheduledPickupDate?: string;
  pickupTime: string;
  status: string;
  trackingStatus: string | null;
  eta: {
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
  payment: PickupReqPayment;
}
export type PickupReqGetResp = {
  _id: string;
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
  status: string;
  trackingStatus?:string | null;
  eta?: {
    text: string | null;
    value: number | null;
  };
  payment: PickupReqPayment;
  userName: string;
  userAddress: Address;
  location?: string;
}
export interface PickupPlansResponse {
  pickups: PickupPlansResp[];
  total: number;
}
export type PickupCancelData = {
  pickupReqId: string;
  reason: string;
};
export type PickupCancelDataResp = {
  payment: PickupReqPayment;
  message: string;
};

export type PickupReqAddress = {
  addressLine1: string;
  addressLine2: string;
  location: string;
  pincode: string;
  district: string;
  state: string;
};
export type ResidPickupReq = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wasteType: string;
  pickupDate: string;
  pickupTime: string;
  addresses?: PickupReqAddress[];
  selectedAddressId?: string;
};

export type PartialResidPickupReq = Partial<ResidPickupReq>;
export interface ValidationErrors {
  [field: string]: string;
}

export type ResidPickupReqArgs = {
  data: PartialResidPickupReq;
};

export type CommPickupReq = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wasteType: string;
  pickupDate: string;
  pickupTime: string;
  addresses?: PickupReqAddress[];
  selectedAddressId?: string;
  service: string;
  businessName: string;
  frequency: string;
};
export type PartialCommPickupReq = Partial<CommPickupReq>;

export type CommPickupReqArgs = {
  data: PartialCommPickupReq;
};
export interface PickupReqDTO  {
  _id: string;
  userId: string;
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
  status: string;
  trackingStatus?: string;
  eta?: {
    text: string | null;
    value: number | null;
  };
  payment: PickupReqPayment;
}
