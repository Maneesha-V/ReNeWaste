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