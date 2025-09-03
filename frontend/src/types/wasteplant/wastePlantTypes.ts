import { WasteplantDTO } from "../superadmin/superAdminTypes";

type PlantStatus = "Pending" | "Active" | "Inactive" | "Rejected";
export type LoginWPResp = {
  success: boolean;
  message: string;
  role: string;
  plantId: string;
  token: string;
  status: string;
}
export type WastePlant = {
  _id?: string;
  plantName: string;
  ownerName: string;
  location: string;
  district: string;
  taluk: string;
  pincode: string;
  state: string;
  contactInfo: string;
  contactNo: string;
  email: string;
  licenseNumber: string;
  capacity: number;
  services: string[];
  status: string;
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
  subscriptionPlan?: string;
  password: string;
  role: "wasteplant";
  isDeleted?: boolean;
  isBlocked?: boolean;
  blockedAt?: Date | null;
  autoUnblockAt?: Date | null;
  unblockNotificationSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type updateProfilePayload = {
  plantName: string;
  ownerName: string;
  location: string;
  taluk: string;
  pincode: string;
  contactInfo: string;
  contactNo: string;
  email: string;
  capacity: number;
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
}
export type PostOffice = {
  name: string;
  taluk: string;
}
export type TogglePlantBlockPayload = {
   plantId: string; 
   isBlocked: boolean
}
export type TogglePlantBlockResp = {
  message: string;
  wasteplant: WasteplantDTO
}
export type WastePlantFormData = {
    plantName: string;
    ownerName: string;
    location: string;
    district: string;
    taluk: string;
    pincode: string;
    state: string;
    contactInfo: string;
    contactNo: string;
    email: string;
    licenseNumber: string;
    capacity: number;
    status: string; 
    subscriptionPlan: string;
    password:string;
    licenseDocument?: File;
    cloudinaryPublicId?: string;
    services: string[];
  }
  export type PartialWastePlantFormData = Partial<WastePlantFormData>;
  // export  type AddWastePlantResp = MsgSuccessResp  & {
  // newWastePlant: {
  //   autoSubscribeAt: Date;
  //   subscribeNotificationSent: boolean;
  // }
  // }
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
    refundStatus?: string;
    refundAt?: Date;
    inProgressExpiresAt: Date;
  };
  driverName?: string;
  userName?: string;
  dueDate: Date;
};
  export type FetchPaymentsResp = {
    success: boolean;
    payments: PaymentRecord[]
    total: number;
  }