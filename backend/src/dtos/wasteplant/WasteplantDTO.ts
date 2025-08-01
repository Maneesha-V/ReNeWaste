import { BaseDTO } from "../base/BaseDTO";

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
  password?: string;
  services?: string[];
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
export interface AddWastePlantResult {
  success: boolean;
}
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
