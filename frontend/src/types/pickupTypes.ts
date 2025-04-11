export interface Address {
    addressLine1: string;
    addressLine2: string;
    location: string;
    pincode: string;
    district: string;
    state: string;
  }
  
  export interface ResidPickupReq {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    wasteType: string;
    pickupDate: string;
    pickupTime: string;
    addresses: Address[];
  }

export type PartialResidPickupReq = Partial<ResidPickupReq>;
export interface ValidationErrors {
  [field: string]: string;
}

export interface ResidPickupReqArgs {
  data: PartialResidPickupReq;
  token: string;
}
