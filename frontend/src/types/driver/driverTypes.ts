import { string } from "zod";

export type DriverDTO = {
   _id: string;
    name: string;
    email: string;
    licenseNumber: string;
    contact: string;
    experience: number;
    status: string;
    licenseFront: string;
    licenseBack: string;
    role: string;
    wasteplantId?: string;
    assignedTruckId?: string;
    assignedZone?: string;
    hasRequestedTruck?: boolean;
    category: string;
    isDeleted?: boolean;
}
export type ReturnTaluk= {
  taluk: string;
}
export type GetCreateDriverResp = {
  data: ReturnTaluk;
  success: boolean;
}
export type FetchDriversResp = {
  success: boolean;
         message: string;
        drivers: DriverDTO[]
        total: number;
}
export type FetchDriverByIdResp = {
  data: {
    driver: DriverDTO;
    taluk: string
  }
}
export type UpdateDriverResp = {
  data: DriverDTO;
  success: boolean;
  message: string;
}
export type DeleteDriverResp = {
  updatedDriver: DriverDTO;
  message: string;
}
export interface DashboardSummary {
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

export interface DriverSupportInfo {
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