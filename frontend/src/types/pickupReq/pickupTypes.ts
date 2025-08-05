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
  payment: PickupReqPayment;
}

export interface PickupPlansResponse {
  pickups: PickupPlansResp[];
  total: number;
}