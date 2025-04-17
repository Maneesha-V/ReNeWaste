export interface TruckFormData {
    name: string,
    vehicleNumber: string,
    capacity: number,
    status: "Active" | "Inactive" | "Suspended",
  }
export type PartialTruckFormData = Partial<TruckFormData>;
export interface ValidationErrors {
  [field: string]: string;
}

export interface UpdateTruckArgs {
  data: FormData;
  token: string;
}
