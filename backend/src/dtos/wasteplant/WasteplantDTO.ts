import { BaseDTO } from "../base/BaseDTO";
import { SubscriptionPaymentHisDTO } from "../subscription/subscptnPaymentDTO";
import { SubsptnPlansDTO } from "../subscription/subscptnPlanDTO";
import { Role } from "../user/userDTO";

export interface WasteplantDTO extends BaseDTO {
  plantName?: string;
  ownerName?: string;
  location?: string;
  district?: string;
  taluk?: string;
  pincode?: string;
  state?: string;
  contactInfo?: string;
  contactNo?: string;
  email?: string;
  licenseNumber?: string;
  capacity?: number;
  status?: string;
  subscriptionPlan?: string; 
  // password?: string;
  role: Role;
  services?: string[];
  isBlocked?: boolean;
  blockedAt?: Date | null;
  autoUnblockAt?: Date | null;
  unblockNotificationSent?: boolean;
  autoSubscribeAt?: Date | null;
  subscribeNotificationSent?: boolean;
  autoRechargeAt?: Date | null;
  rechargeNotificationSent?: boolean;
  renewNotificationSent?: boolean;
}
export interface IWastePlant {
  plantName?: string;
  ownerName?: string;
  location?: string;
  district?: string;
  taluk?: string;
  pincode?: string;
  state?: string;
  contactInfo?: string;
  contactNo?: string;
  email?: string;
  licenseNumber?: string;
  capacity?: number;
  services?: string[];
  status?: "Pending" | "Active" | "Inactive" | "Rejected";
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
  subscriptionPlan?: string;
  password?: string;
  role?: "wasteplant";
  isDeleted?: boolean;
  isBlocked?: boolean;
  blockedAt?: Date;
  autoUnblockAt?: Date;
  unblockNotificationSent?: boolean;
  autoSubscribeAt?: Date | null;
  subscribeNotificationSent?: boolean;
  autoRechargeAt?: Date | null;
  rechargeNotificationSent?: boolean;
  renewNotificationSent?: boolean;
}
export type LoginWPResponse = {
  wastePlant: WasteplantDTO;
  token: string;
}
export interface IndiaPostAPIResponse {
  Status: string;
  PostOffice: PostOfficeEntry[] | null;
}

export interface PostOfficeEntry {
  Name: string;
  Taluk: string;
  SubDivision: string;
  Block: string;
  Division: string;
  District: string;
}
// export interface AddWastePlantResult {
//   autoSubscribeAt: Date;
//   subscribeNotificationSent: boolean;
// }
export interface PaginatedWastePlantResult {
  wasteplants: WasteplantDTO[];
  total: number;
}
export interface ReturnAdminWastePlant {
  plantData: WasteplantDTO;
  latestSubscription: {
    subPaymentStatus?: string;
    expiredAt?: Date;
    daysLeft?: number;
  } | null;
};
export interface PaginatedReturnAdminWastePlants {
  total: number;
  wasteplants: ReturnAdminWastePlant[];
}
export type ReturnDeleteWP = {
  plantId: string;
};
export type PaymentData = {
     razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      planId: string;
      amount: number;
      billingCycle: string;
}
export type VerifyPaymtReq = {
    paymentData: PaymentData;
    plantId: string;
}
export type VerifyPaymtResp = {
  subPayId: string;
  expiredAt: Date | null
}
export type plantDataType = {
  createdAt: Date;
  status: string;
  plantName: string;
  ownerName: string;
  license: string;
  expiredAt: Date | null;
};
export type ReturnFetchSubptnPlan = {
  plantData: plantDataType;
  subscriptionData: SubsptnPlansDTO;
};

export type ReturnSubcptnPaymentResult = {
  paymentData: SubscriptionPaymentHisDTO[]; 
}