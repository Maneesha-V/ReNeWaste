import { PickupTrendResult } from "../wasteplant/WasteplantDTO";

export interface PaginationInput {
  page: number;
  limit: number;
  search: string;
  filter?: string;
  minCapacity?: number;
  maxCapacity?: number;
}
export interface SendOtpResponse {
  message: string;
}
export type DashboardDataResp = {
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
  revenue: {
    totalResidentialRevenue: number;
    totalCommercialRevenue: number;
    totalRevenue: number;
  };
  pickupTrends: PickupTrendResult[];
};
interface EtaResult {
  text: string;
  value: number;
}

interface Location {
  lat: number;
  lng: number;
}

export interface GetAndSaveETAResponse {
  duration: EtaResult;
  location: Location;
}
