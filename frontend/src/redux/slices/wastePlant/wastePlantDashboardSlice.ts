import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../../services/wastePlant/dashboardService";

// interface DashboardState {
//   loading: boolean;
//   error: string | null;
//   drivers: number;
//   trucks: number;
//   pickups: number;
//   revenue: number;
//   waste: number;
// }

// const initialState: DashboardState = {
//   loading: false,
//   error: null,
//   drivers: 0,
//   trucks: 0,
//   pickups: 0,
//   revenue: 0,
//   waste: 0,
// };

interface DashboardState {
  loading: boolean;
  error: string | null;
  summary: {
    totalDrivers: { active: number; inactive: number; suspended: number };
    totalTrucks: { active: number; inactive: number; maintenance: number };
    totalActivePickups: number;
    totalCompletedPickups: number;
    totalWasteCollected: { totalResidWaste: number; totalCommWaste: number };
    totalRevenue: number;
  };
  pickupStatus: any;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  summary: {
    totalDrivers: { active: 0, inactive: 0, suspended: 0 },
    totalTrucks: { active: 0, inactive: 0, maintenance: 0 },
    totalActivePickups: 0,
    totalCompletedPickups: 0,
    totalWasteCollected: { totalResidWaste: 0, totalCommWaste: 0 },
    totalRevenue: 0,
  },
  pickupStatus: null,
};

export const fetchDashboardData = createAsyncThunk(
  "wastePlantDashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboard();
      console.log("resp", response);

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
      // .addCase(fetchDashboardData.fulfilled, (state, action) => {
      //   console.log("action", action);
      //   state.loading = false;
      //   const { drivers, trucks, pickupStatus, revenue, totalWasteCollected } = action.payload;
      //   state.drivers = drivers;
      //   state.trucks = trucks;
      //   state.pickups = pickupStatus;
      //   state.revenue = revenue;
      //   state.waste = totalWasteCollected;
      // })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.pickupStatus = action.payload.pickupStatus;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wasteplantDashboardSlice.reducer;
