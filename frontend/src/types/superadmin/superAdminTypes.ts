export interface MonthlyRevenueEntry {
  month: string;
  totalRevenue: number;
}
export interface DashboardAdminSummary {
 adminData: {
    name: string;
  };
  totalPlants: number;
  totalTrucks: number;
  totalDrivers: number;
  totalWasteCollected: number;
  monthlyRevenue: MonthlyRevenueEntry[];
}

