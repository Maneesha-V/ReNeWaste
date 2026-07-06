import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { AttendancePieItemDTO } from "../attendance/attendanceDTO";
import { BaseDTO } from "../base/BaseDTO";

export interface DriverDTO extends BaseDTO {
  name: string;
  email: string;
  licenseNumber: string;
  contact: string;
  experience: number;
  status: "Active" | "Inactive" | "Suspended";
  licenseFront: string;
  licenseBack: string;
  role: "driver";
  wasteplantId?: string;
  assignedTruckId?: string;
  assignedZone?: string;
  hasRequestedTruck?: boolean;
  category: "Residential" | "Commercial" | "Pending";
  isDeleted?: boolean;
}
export type PaginatedDriversResult = {
  drivers: DriverDTO[];
  total: number;
};
export type ReturnTaluk = {
  taluk: string;
};
export type ReturnGetEditDriver = {
  driver: DriverDTO;
  taluk: string;
};

export interface DriverDashboardSummary {
  driver: {
    name: string;
    email: string;
    assignedZone?: string;
  };
  truck: {
    name: string;
    vehicleNumber: string;
    status: string;
  } | null;
  pickupStats: {
    assignedTasks: number;
    completedTasks: number;
  };
  recentActivities: DriverPickupCompleted[];
  attendanceData: AttendancePieItemDTO[];
}
export interface Address {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  taluk: string;
  location: string;
  state: string;
  pincode: string;
  district: string;
  latitude?: number | null;
  longitude?: number | null;
}
export interface DriverPickupCompleted {
  pickupId: string;
  status: string;
  completedAt: Date;
  selectedAddress: Address;
}
export interface DriverDashboardResponse {
  summary: DriverDashboardSummary;
}
export interface WastePlantInfo {
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
}
export interface DriverSupportInfo {
  supportInfo: WastePlantInfo | null;
}
export type LoginRequest = {
  email: string;
  password: string;
};
export type LoginResponse = {
  driver: DriverDTO;
  token: string;
};
export type MarkReturnProps = {
  truckId: string;
  plantId: string;
  driverId: string;
};
export type MarkTruckReturnResult = {
  driver: IDriverDocument;
  truck: ITruckDocument;
};
export type MarkPickupCompletedResp = {
  pickupReqId: string;
  status: string;
};
export type ReturnFetchAllDriversByPlantId = {
  active: number;
  inactive: number;
  suspended: number;
};
