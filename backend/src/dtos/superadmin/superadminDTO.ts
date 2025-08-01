export interface SuperAdminDashboardData {
  adminData: {
    name: string;
  };
  totalPlants: number;
  totalTrucks: number;
  totalDrivers: number;
  totalWasteCollected: number;
  monthlyRevenue: { month: string; totalRevenue: number }[];
}
