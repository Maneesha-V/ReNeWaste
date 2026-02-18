import { Auth, GoogleAuthProvider } from "firebase/auth";
import { PickupTrendResult } from "../wasteplant/wastePlantTypes";
import { RevenueWPTrendDTO } from "../wallet/walletTypes";

  export type LoginRequest = {
    email: string;
    password: string;
  }
  
export type TokenResp = {
  token: string;
}
export type MsgResp = {
  message: string;
}
export type MsgSuccessResp = {
  message: string;
  success: boolean;
}
export type SendOtpError = {
   message: string;
}
export type VerifyOtpReq = {
  email: string; 
  otp: string
}
export type ResetPasswordReq = {
  email: string; 
  password: string
}
export type GoogleSignUpArgs = {
  auth: Auth;
  googleProvider: GoogleAuthProvider;
}; 
export type GoogleSignUpResp = {
  message: string;
  role: string;
  token: string;
}

export type PaginationPayload = {
  page?: number;
  limit?: number;
  search: string;
  filter?: string;
  capacityRange?: string;
}
export interface PaginationSearchProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  searchValue: string;
}

export interface PaginationSearchFilterProps extends Pick<PaginationSearchProps, "searchValue" | "onSearchChange"> {
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  placeholder?: string;
  capacityFilterValue?: string;
  onCapacityFilterChange?: (val: string) => void;
  paymentStatusFilterValue?: string;
  onPaymentStatusFilterChange?: (value: string) => void;
}
export type MsgResponse = {
  message: string;
}
export type NotificationBadgeProps = {
  count: number;
};
export interface ValidationErrors {
  [field: string]: string;
}
export type  DashboardDataResp = {
  summary: {
    totalDrivers: {
      active: number;
      inactive: number;
      suspended: number;
    };
    totalTrucks: {
      active: number;
      inactive: number;
      maintenance: number;
    };
    totalActivePickups: number;
    totalCompletedPickups: number;
    totalWasteCollected: {
      totalResidWaste: number;
      totalCommWaste: number;
    };
    totalRevenue: number;
  };
  pickupStatus: {
    Residential: {
      Pending: number;
      Scheduled: number;
      Rescheduled: number;
      Completed: number;
      Cancelled: number;
      Active: number;
    };
    Commercial: {
      Pending: number;
      Scheduled: number;
      Rescheduled: number;
      Completed: number;
      Cancelled: number;
      Active: number;
    };
  };
  drivers: {
    active: number;
    inactive: number;
    suspended: number;
  };
  trucks: {
    active: number;
    inactive: number;
    maintenance: number;
  };
  pickupTrends: PickupTrendResult[];
  revenueTrends: RevenueWPTrendDTO[];
};
 export type FormErrors = {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;  
    agreeToTerms?: string;
  };
  export interface ProtectedRouteProps {
    allowedRoles: string[];
}
interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  paths: BreadcrumbItem[];
  fullWidth?: boolean;
}
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
export interface ProfValidationErrors {
  [field: string]: string[];
}
export interface SocketProviderProps {
  children: React.ReactNode;
}