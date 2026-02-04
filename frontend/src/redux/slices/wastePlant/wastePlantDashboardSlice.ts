import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDashboard } from "../../../services/wastePlant/dashboardService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { DashboardDataResp } from "../../../types/common/commonTypes";
import { PickupTrendResult, WPDashboardReq } from "../../../types/wasteplant/wastePlantTypes";

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
  pickupTrends: PickupTrendResult[];
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
  pickupTrends: [],
};

export const fetchDashboardData = createAsyncThunk<
DashboardDataResp,
WPDashboardReq,
{rejectValue: {message: string}}
>(
  "wastePlantDashboard/fetchDashboardData",
  async (filterData, { rejectWithValue }) => {
    try {
      const response = await getDashboard(filterData);
      console.log("resp", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
             return rejectWithValue({ message: msg });
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
        state.pickupTrends = action.payload.pickupTrends;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default wasteplantDashboardSlice.reducer;
