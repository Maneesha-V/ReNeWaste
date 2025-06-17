export type Address = {
    addressLine1: string;
    addressLine2: string;
    taluk: string;
    location: string;
    pincode: string;
    district: string;
    state: string;
  }
  
  export type UserProfile = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addresses: Address[];
  }
  