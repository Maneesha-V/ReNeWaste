import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../../services/wastePlant/dashboardService";

interface DashboardState {
  loading: boolean;
  error: string | null;
  drivers: number;
  trucks: number;
  pickups: number;
  revenue: number;
  waste: number;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  drivers: 0,
  trucks: 0,
  pickups: 0,
  revenue: 0,
  waste: 0,
};

export const fetchDashboardData = createAsyncThunk(
  "wastePlantDashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboard();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch dashboard data."
      );
    }
  }
);

const wasteplantDashboardSlice = createSlice({
  name: "wastePlantDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        console.log("action",action);
        
        state.loading = false;
        const { totalDrivers, totalTrucks, activePickups, totalRevenue } = action.payload.dashboardStats;
        state.drivers = totalDrivers;
        state.trucks = totalTrucks;
        state.pickups = activePickups;
        state.revenue = totalRevenue;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wasteplantDashboardSlice.reducer;
