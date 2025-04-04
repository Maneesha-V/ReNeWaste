export interface WastePlantFormData {
    plantName: string;
    ownerName: string;
    location: string;
    city: string;
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
  }

export interface ValidationErrors {
  [field: string]: string;
}