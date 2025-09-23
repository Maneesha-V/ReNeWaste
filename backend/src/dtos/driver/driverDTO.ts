import { IDriverDocument } from "../../models/driver/interfaces/driverInterface";
import { ITruckDocument } from "../../models/truck/interfaces/truckInterface";
import { BaseDTO } from "../base/BaseDTO";
import { TruckDTO } from "../truck/truckDTO";

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
}
export type ReturnTaluk= {
  taluk: string;
}
export type ReturnGetEditDriver = {
  driver : DriverDTO;
  taluk : string;
}

export interface DriverDashboardSummary {
  driver: {
    name: string;
    email: string;
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
}
export type LoginResponse = {
  driver: DriverDTO;
  token: string;
}
export type MarkTruckReturnResult = {
  driver: IDriverDocument;
  truck: ITruckDocument;
}
export type MarkPickupCompletedResp = {
  pickupReqId: string;
  status: string;
}