import { MsgSuccessResp } from "../common/commonTypes";
import { SubsptnPlans } from "../subscription/subscriptionTypes";

export type SuperAdmin = {
     username: string; 
      email: string;
      role: string;
}

export type SignUpReq = {
    username: string;
    email: string;
    password: string;
}
 export type LoginRequest = {
    email: string;
    password: string;
  }
  export type LoginResponse = {
  message: string;
  role: string;
  success: boolean;
  token: string;
  adminId: string;
};
export interface MonthlyRevenueEntry {
  month: string;
  totalRevenue: number;
}
export interface DashboardAdminSummary {
 adminData: {
    name: string;
  };
  totalPlants: number;
  totalTrucks: number;
  totalDrivers: number;
  totalWasteCollected: number;
  monthlyRevenue: MonthlyRevenueEntry[];
}
export interface WasteplantDTO {
  _id?: string;
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
  password?: string;
  services?: string[];
  isBlocked?: boolean;
  blockedAt?: Date;
  autoUnblockAt?: Date;
  unblockNotificationSent?: Boolean;
  licenseDocumentPath?: string;
  cloudinaryPublicId?: string;
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
  message: string;
  success: boolean;
  total: number;
  wasteplants: ReturnAdminWastePlant[];
}
export type FetchPlantByIdResp = {
  success: boolean;
  wastePlant: WasteplantDTO;
}
export type DelPlantResp = {
  updatedPlant: {
    plantId: string;
  };
  success: boolean;
  message: string;
}
export type FetchAddWPResp = MsgSuccessResp & {
 subscriptionPlans: SubsptnPlans[];
}
