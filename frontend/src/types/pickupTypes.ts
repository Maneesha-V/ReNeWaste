

export type Address = {
    addressLine1: string;
    addressLine2: string;
    location: string;
    pincode: string;
    district: string;
    state: string;
  }
  
  export type ResidPickupReq = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    wasteType: string;
    pickupDate: string;
    pickupTime: string;
    addresses?: Address[];
    selectedAddressId?: string; 
  }

export type PartialResidPickupReq = Partial<ResidPickupReq>;
export interface ValidationErrors {
  [field: string]: string;
}

export interface ResidPickupReqArgs {
  data: PartialResidPickupReq;
}

export type CommPickupReq = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wasteType: string;
  pickupDate: string;
  pickupTime: string;
  addresses?: Address[];
  selectedAddressId?: string; 
  service: string;
  businessName: string;
  frequency: string;
}
export type PartialCommPickupReq = Partial<CommPickupReq>;

export interface CommPickupReqArgs {
  data: PartialCommPickupReq;
}
// export type ApprovePickupPayload = {
//   pickupReqId: string;
//   pickupId: string;
//   status: string;
//   driverId: string;
//   assignedTruckId: string;
// }
