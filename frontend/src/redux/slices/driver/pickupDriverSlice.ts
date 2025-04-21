import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEtaService, fetchPickupByIdService, getDriverPickups, markPickupService } from "../../../services/driver/pickupService";
import { FetchPickupsParams } from "../../../types/driverTypes";

interface PickupState {
  pickups: any;
  selectedPickup: any;
  eta: string | null;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: PickupState = {
  pickups: [],
  selectedPickup: null, 
  eta: null,
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
  export const fetchPickupById = createAsyncThunk(
    "driverPickups/fetchPickupById",
    async (pickupReqId: string, { rejectWithValue }) => {
      try { 
        const response = await fetchPickupByIdService(pickupReqId);
        return response;
      } catch (err: any) {
        console.error("err",err);
        return rejectWithValue(err.response?.data?.message || "Unable to fetch pickup");
      }
    }
  );
  export const fetchEta  = createAsyncThunk(
    "driverPickups/fetchEta",
    async ({ origin, destination, pickupReqId }: { origin: string; destination: string; pickupReqId: string }, { rejectWithValue }) => {
      try { 
        const response = await fetchEtaService({ origin, destination, pickupReqId});
        return response;
      } catch (err: any) {
        console.error("err",err);
        return rejectWithValue(err.response?.data?.message || "Unable to calculate ETA");
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
      })
      .addCase(fetchPickupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupById.fulfilled, (state, action) => {
        state.selectedPickup = action.payload;
        state.loading = false;
      })
      .addCase(fetchPickupById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchEta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEta.fulfilled, (state, action) => {
        state.loading = false;
        state.eta = action.payload;
      })
      .addCase(fetchEta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
},
});

export default driverPickupSlice.reducer;
