import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  getDriverDashboard,
  getWastePlantSupport,
} from "../../../services/driver/dashboardService";
import {
  DashboardSummary,
  DriverSupportInfo,
} from "../../../types/driver/driverTypes";

interface DashboardState {
  loading: boolean;
  error: string | null;
  summary: DashboardSummary | null;
  supportInfo: any;
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  summary: null,
  supportInfo: null,
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
      });
  },
});

export default driverDashboardSlice.reducer;
