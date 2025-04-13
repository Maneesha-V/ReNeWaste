export interface WastePlantFormData {
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
    services: string[];
  }
export type PartialWastePlantFormData = Partial<WastePlantFormData>;
export interface ValidationErrors {
  [field: string]: string;
}