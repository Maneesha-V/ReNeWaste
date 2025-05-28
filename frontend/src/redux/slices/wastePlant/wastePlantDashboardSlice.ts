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
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        const { drivers, trucks, pickups, revenue, waste } = action.payload;
        state.drivers = drivers;
        state.trucks = trucks;
        state.pickups = pickups;
        state.revenue = revenue;
        state.waste = waste;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wasteplantDashboardSlice.reducer;
