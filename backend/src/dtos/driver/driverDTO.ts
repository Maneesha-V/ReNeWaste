
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