import { ReactNode } from "react";

export interface DriverFormData {
    name: string,
    contact: string,
    email: string,
    licenseNumber: string,
    experience: number,
    status: "Active" | "Inactive" | "Suspended",
    password: string,
    licenseFront?: File,
    licenseBack?: File,
    assignedZone: string,
  }
export type PartialDriverFormData = Partial<DriverFormData>;
export interface ValidationErrors {
  [field: string]: string;
}

export interface UpdateDriverArgs {
  data: FormData;
}

type WasteType = "Residential" | "Commercial";
export interface FetchPickupsParams {
  wasteType: WasteType;
}

export type DriverHeaderProps = {
  collapsed: boolean;
  toggleCollapse: () => void;
};
export type DriverSidebarProps = {
  collapsed: boolean;
  children?: ReactNode;
};
export type markReturnedProps = {
  truckId: string;
  plantId: string;
}