import { ReactNode } from "react";

export type WastePlantFormData = {
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
    licenseNumber: string;
    capacity: number;
    status: "Pending" | "Active" | "Inactive" | "Rejected"; 
    subscriptionPlan: string;
    password:string;
    licenseDocument?: File;
    cloudinaryPublicId?: string;
    services: string[];
  }
export type PartialWastePlantFormData = Partial<WastePlantFormData>;
export interface ValidationErrors {
  [field: string]: string;
}
// export interface DriverChatWindowProps {
//   driver: any;
//   wasteplantId: string;
// }
export interface ReschedulePickupModalProps {
  visible: boolean;
  onClose: () => void;
  pickup: any;
  onSubmit: (formData: any) => void;
}
export type SidebarWastePlantProps = {
  collapsed: boolean;
  children?: ReactNode;
  isNotifOpen: boolean;
};
export type PickupRequest = {
  _id: string;
  userId: string;
  userName: string;
  location: string;
  wasteType: "Residential" | "Commercial";
  originalPickupDate: string;
  pickupTime: string;
  pickupId: string;
  status: "Pending" | "Scheduled" | "Cancelled" | "Completed" | "Rescheduled";
}

export type PickupCancelData = {
  pickupReqId: string;
  reason: string;
}

export type RenewNotificationPayload = {
  plantId: string;
  daysLeft: number;
}