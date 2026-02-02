import { AttendancePieItemDTO } from "../attendance/attendanceTypes";
import { MsgSuccessResp } from "../common/commonTypes";
import { PickupPlansResp, PickupReqDTO, PickupReqGetResp } from "../pickupReq/pickupTypes";
import { Address } from "../user/userTypes";

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
};
export type ReturnTaluk = {
  taluk: string;
};
export type GetCreateDriverResp = {
  data: ReturnTaluk;
  success: boolean;
};
export type FetchDriversResp = {
  success: boolean;
  message: string;
  drivers: DriverDTO[];
  total: number;
};
export type FetchDriverByIdResp = {
  data: {
    driver: DriverDTO;
    taluk: string;
  };
};
export type UpdateDriverResp = {
  data: DriverDTO;
  success: boolean;
  message: string;
};
export type DeleteDriverResp = {
  updatedDriver: DriverDTO;
  message: string;
};
export interface DashboardSummary {
  driver: {
    name: string;
    email: string;
    assignedZone: string;
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
export interface DriverPickupCompleted {
  pickupId: string;
  status: string;
  completedAt: string;
  selectedAddress: Address;
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
export type LoginRequest = {
  email: string;
  password: string;
};
export type LoginResponse = {
  success: boolean;
  message: string;
  category: string;
  driverId: string;
  role: string;
  token: string;
};
export interface UpdateDriverArgs {
  data: FormData;
}
export type FetchDriverProfileResp = {
  driver: DriverDTO;
};
export type UpdateDriverProfileResp = {
  updatedDriver: DriverDTO;
  message: string;
};
export type FetchDriversRespns = {
  drivers: DriverDTO[];
};
export type markReturnedProps = {
  truckId: string;
  plantId: string;
};
export interface ValidationErrors {
  [field: string]: string;
}
export type DriverFormData = {
  name: string;
  contact: string;
  email: string;
  licenseNumber: string;
  experience: number;
  status: "Active" | "Inactive" | "Suspended";
  password: string;
  licenseFront?: File;
  licenseBack?: File;
  assignedZone: string;
  category: "Residential" | "Commercial" | "Pending";
};
export type PartialDriverFormData = Partial<DriverFormData>;
export type FetchDriverPickupsReq = {
  wasteType: string;
};
export type FetchDriverPickupsResp = {
   success: string;
  pickups: PickupPlansResp[]
}
export type MarkPickupCompletedResp = MsgSuccessResp & { 
  pickupStatus: {
    pickupReqId: string;
    status: string;
  }
}
export type FetchPickupByIdResp = {
  success: string;
  pickup: PickupReqGetResp;
}
export type FetchEtaReq = {
  origin: string;
  destination: string;
  pickupReqId: string;
  addressId: string;
};
interface EtaResult {
  text: string;
  value: number;
}

interface Location {
  lat: number;
  lng: number;
}
export type FetchEtaResp = {
 duration: EtaResult;
  location: Location;
}

export type UpdateAddressLatLngReq = {
addressId: string; 
latitude: number; 
longitude: number
}
export type UpdateAddressLatLngResp = {
success: string;
updatedAddress: Address;
}

export type UpdateTrackingStatusReq ={
pickupReqId: string; 
trackingStatus: string;
}
export type UpdateTrackingStatusResp ={
success: string; 
updatedPickup: PickupReqDTO;
}

