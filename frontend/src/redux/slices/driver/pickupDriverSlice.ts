import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDriverPickups, markPickupService } from "../../../services/driver/pickupService";
import { FetchPickupsParams } from "../../../types/driverTypes";

interface PickupState {
  pickups: any;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: PickupState = {
  pickups: [],
  loading: false,
  message: null,
  error: null,
};
export const fetchDriverPickups = createAsyncThunk(
  "driverPickups/fetchDriverPickups",
  async ({ wasteType }: FetchPickupsParams, { rejectWithValue }
  ) => {
    try {
      const response = await getDriverPickups(wasteType);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch pickups");
    }
  }
);
export const markPickupCompleted = createAsyncThunk(
    "driverPickups/markCompleted",
    async (pickupReqId: string, { rejectWithValue }) => {
      try { 
        const response = await markPickupService(pickupReqId);
        return response;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Unable to complete pickup");
      }
    }
  );
const driverPickupSlice = createSlice({
  name: "driverPickups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverPickups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverPickups.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
      })
      .addCase(fetchDriverPickups.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markPickupCompleted.fulfilled, (state, action) => {
        state.pickups = state.pickups.map((pickup: any) =>
          pickup._id === action.payload._id ? action.payload : pickup
        );
      });
},
});

export default driverPickupSlice.reducer;
