import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  fetchDriverEarnStats,
  getDriverDashboard,
  getWastePlantSupport,
  markDriverAttendance,
} from "../../../services/driver/dashboardService";
import {
  DashboardSummary,
  DriverSupportInfo,
} from "../../../types/driver/driverTypes";
import { MsgSuccessResp } from "../../../types/common/commonTypes";
import { DriverEarnRewardStat, FetchDriverEarnStatsReq, FetchDriverEarnStatsResp } from "../../../types/attendance/attendanceTypes";

interface DashboardState {
  loading: boolean;
  error: string | null;
  summary: DashboardSummary | null;
  supportInfo: any;
  earnRewardFilter: DriverEarnRewardStat[];
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  summary: null,
  supportInfo: null,
  earnRewardFilter: [],
};

export const fetchDriverDashboard = createAsyncThunk<
  { summary: DashboardSummary },
  void,
  { rejectValue: { message: string } }
>("driverDashboard/fetchDriverDashboard", async (_, { rejectWithValue }) => {
  try {
    const response = await getDriverDashboard();
    console.log("resp", response);

    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const fetchWastePlantSupport = createAsyncThunk<
  { supportInfo: DriverSupportInfo },
  void,
  { rejectValue: { message: string } }
>("driverDashboard/fetchWastePlantSupport", async (_, { rejectWithValue }) => {
  try {
    const response = await getWastePlantSupport();
    console.log("respppp", response);

    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const markAttendance = createAsyncThunk<
  MsgSuccessResp,
  string,
  { rejectValue: { message: string } }
>("driverDashboard/markAttendance", async (status, { rejectWithValue }) => {
  try {
    const response = await markDriverAttendance(status);
    console.log("respppp", response);

    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const fetchEarnDriverStats = createAsyncThunk<
  FetchDriverEarnStatsResp,
  FetchDriverEarnStatsReq,
  { rejectValue: { message: string } }
>("driverDashboard/fetchEarnDriverStats", async (filterData, { rejectWithValue }) => {
  try {
    const response = await fetchDriverEarnStats(filterData);
    console.log("respppp", response);

    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

const driverDashboardSlice = createSlice({
  name: "driverDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverDashboard.fulfilled, (state, action) => {
        console.log("accc", action.payload);

        state.loading = false;
        state.summary = action.payload.summary;
      })
      .addCase(fetchDriverDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(fetchWastePlantSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlantSupport.fulfilled, (state, action) => {
        console.log("accc", action.payload);

        state.loading = false;
        state.supportInfo = action.payload.supportInfo;
      })
      .addCase(fetchWastePlantSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        console.log("accc", action.payload);

        state.loading = false;
        // state.supportInfo = action.payload.supportInfo;
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
        .addCase(fetchEarnDriverStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnDriverStats.fulfilled, (state, action) => {
        console.log("accc", action.payload);

        state.loading = false;
        state.earnRewardFilter = action.payload.earnRewardStats;
      })
      .addCase(fetchEarnDriverStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
  },
});

export default driverDashboardSlice.reducer;
