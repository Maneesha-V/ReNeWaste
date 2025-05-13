import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEtaService, fetchPickupByIdService, getDriverPickups, markPickupService, updateAddressLatLngService, updateTrackingStatusService } from "../../../services/driver/pickupService";
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
      console.error("err",error);
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
    async ({ origin, destination, pickupReqId, addressId }: { origin: string; destination: string; pickupReqId: string; addressId: string; }, { rejectWithValue }) => {
      try { 
        const response = await fetchEtaService({ origin, destination, pickupReqId,addressId});
        console.log("response",response);
        
        return response;
      } catch (err: any) {
        console.error("err",err);
        return rejectWithValue(err.response?.data?.message || "Unable to calculate ETA");
      }
    }
  );
  export const updateAddressLatLng  = createAsyncThunk(
    "driverPickups/updateAddressLatLng",
    async (
      {
        addressId,
        latitude,
        longitude,
      }: { addressId: string; latitude: number; longitude: number }
      , { rejectWithValue }) => {
      try { 
        const response = await updateAddressLatLngService({ addressId, latitude, longitude,});
        console.log("reee",response);
        
        return response;
      } catch (err: any) {
        console.error("err",err);
        return rejectWithValue(err.response?.data?.message || "Failed to update address location");
      }
    }
  );
  export const updateTrackingStatus  = createAsyncThunk(
    "driverPickups/updateTrackingStatus",
    async (
      {
        pickupReqId,
        trackingStatus
      }: { pickupReqId: string; trackingStatus: string;}
      , { rejectWithValue }) => {
      try { 
        const response = await updateTrackingStatusService({ pickupReqId, trackingStatus });
        console.log("reee",response);
        
        return response;
      } catch (err: any) {
        console.error("err",err);
        return rejectWithValue(err.response?.data?.message || "Failed to update tracking status");
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
      })
      .addCase(updateAddressLatLng.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddressLatLng.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPickup && state.selectedPickup.selectedAddress) {
          state.selectedPickup.selectedAddress.latitude = action.payload.latitude;
          state.selectedPickup.selectedAddress.longitude = action.payload.longitude;
        }
      })
      .addCase(updateAddressLatLng.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTrackingStatus.fulfilled, (state, action) => {
        const updatedStatus = action.payload?.trackingStatus;
        if (state.selectedPickup && updatedStatus) {
          state.selectedPickup.trackingStatus = updatedStatus;
        }
      })
      .addCase(updateTrackingStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
},
});

export default driverPickupSlice.reducer;
