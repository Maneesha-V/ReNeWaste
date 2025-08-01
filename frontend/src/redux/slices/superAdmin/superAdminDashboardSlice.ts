import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { getSuperAdminDashboard } from "../../../services/superAdmin/dashboardService";
import { DashboardAdminSummary } from "../../../types/superadmin/superAdminTypes";


interface SuperAdminDashboardState  {
  loading: boolean;
  error: string | null;
  summary: DashboardAdminSummary | null;
}

const initialState: SuperAdminDashboardState = {
  loading: false,
  error: null,
   summary: {
    adminData: {
      name: "",
    },
    totalPlants: 0,
    totalTrucks: 0,
    totalDrivers: 0,
    totalWasteCollected: 0,
    monthlyRevenue: [],
  },
};

export const fetchSuperAdminDashboard = createAsyncThunk<
{ summary: DashboardAdminSummary },
void,
{ rejectValue : {message: string}}
>(
  "superAdminDashboard/fetchSuperAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSuperAdminDashboard();
      console.log("resp", response);

      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);


const superAdminDashboardSlice = createSlice({
  name: "superAdminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminDashboard.fulfilled, (state, action) => {
        console.log("accc",action.payload);
        
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
    },
});

export default superAdminDashboardSlice.reducer;
