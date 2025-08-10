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
