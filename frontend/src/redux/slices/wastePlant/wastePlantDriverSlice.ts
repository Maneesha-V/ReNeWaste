import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDriver,
  getDrivers,
} from "../../../services/wastePlant/driverService";

interface DriverState {
  driver: any;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: DriverState = {
  driver: [],
  loading: false,
  message: null,
  error: null,
};

export const addDriver = createAsyncThunk(
  "wastePlantDriver/addDriver",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createDriver(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add waste plant"
      );
    }
  }
);
export const fetchDrivers = createAsyncThunk(
  "wastePlantDriver/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDrivers();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch waste plants"
      );
    }
  }
);
const wastePlantDriverSlice = createSlice({
  name: "wastePlantDriver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload || [];
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wastePlantDriverSlice.reducer;
