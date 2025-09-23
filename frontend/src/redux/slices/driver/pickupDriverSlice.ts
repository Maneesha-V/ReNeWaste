import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEtaService,
  fetchPickupByIdService,
  getDriverPickups,
  markPickupService,
  updateAddressLatLngService,
  updateTrackingStatusService,
} from "../../../services/driver/pickupService";
import {
  FetchDriverPickupsReq,
  FetchDriverPickupsResp,
  FetchEtaReq,
  FetchEtaResp,
  FetchPickupByIdResp,
  MarkPickupCompletedResp,
  UpdateAddressLatLngReq,
  UpdateAddressLatLngResp,
  UpdateTrackingStatusReq,
  UpdateTrackingStatusResp,
} from "../../../types/driver/driverTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { PickupPlansResp, PickupReqGetResp } from "../../../types/pickupReq/pickupTypes";

interface PickupState {
  pickups: PickupPlansResp[];
  selectedPickup: PickupReqGetResp | null;
  eta: FetchEtaResp | null;
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
export const fetchDriverPickups = createAsyncThunk<
  FetchDriverPickupsResp,
  FetchDriverPickupsReq,
  { rejectValue: { message: string } }
>(
  "driverPickups/fetchDriverPickups",
  async ({ wasteType }: FetchDriverPickupsReq, { rejectWithValue }) => {
    try {
      const response = await getDriverPickups(wasteType);
      console.log("response", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const markPickupCompleted = createAsyncThunk<
  MarkPickupCompletedResp,
  string,
  { rejectValue: { message: string } }
>(
  "driverPickups/markCompleted",
  async (pickupReqId: string, { rejectWithValue }) => {
    try {
      const response = await markPickupService(pickupReqId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchPickupById = createAsyncThunk<
  FetchPickupByIdResp,
  string,
  { rejectValue: { message: string } }
>(
  "driverPickups/fetchPickupById",
  async (pickupReqId: string, { rejectWithValue }) => {
    try {
      const response = await fetchPickupByIdService(pickupReqId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchEta = createAsyncThunk<
  FetchEtaResp,
  FetchEtaReq,
  { rejectValue: { message: string } }
>("driverPickups/fetchEta", async (data: FetchEtaReq, { rejectWithValue }) => {
  try {
    const response = await fetchEtaService(data);
    console.log("response", response);

    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const updateAddressLatLng = createAsyncThunk<
  UpdateAddressLatLngResp,
  UpdateAddressLatLngReq,
  { rejectValue: { message: string } }
>(
  "driverPickups/updateAddressLatLng",
  async (data: UpdateAddressLatLngReq, { rejectWithValue }) => {
    try {
      const response = await updateAddressLatLngService(data);
      console.log("reee", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const updateTrackingStatus = createAsyncThunk<
  UpdateTrackingStatusResp,
  UpdateTrackingStatusReq,
  { rejectValue: { message: string } }
>(
  "driverPickups/updateTrackingStatus",
  async (data: UpdateTrackingStatusReq, { rejectWithValue }) => {
    try {
      // const {pickupReqId,trackingStatus} = data;
      const response = await updateTrackingStatusService(data);
      console.log("reee", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
const driverPickupSlice = createSlice({
  name: "driverPickups",
  initialState,
  reducers: {
    updatePickupCompletnStatus: (state, action) => {
      const {pickupReqId, status} = action.payload;
      const index = state.pickups.findIndex((pickup) => pickup._id === pickupReqId)
      if(index !== -1){
        state.pickups[index].status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverPickups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverPickups.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.loading = false;
        state.pickups = action.payload.pickups;
      })
      .addCase(fetchDriverPickups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(markPickupCompleted.fulfilled, (state, action) => {
        state.pickups = state.pickups.map((pickup: PickupPlansResp) => {
          if (pickup._id === action.payload.pickupStatus.pickupReqId) {
            return {
              ...pickup,
              status: action.payload.pickupStatus.status,
            };
          }
          return pickup;
        });
      })
      .addCase(fetchPickupById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupById.fulfilled, (state, action) => {
        state.selectedPickup = action.payload.pickup;
        state.loading = false;
      })
      .addCase(fetchPickupById.rejected, (state, action) => {
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      })
      .addCase(updateAddressLatLng.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddressLatLng.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPickup && state.selectedPickup.userAddress) {
          state.selectedPickup.userAddress.latitude =
            action.payload.updatedAddress.latitude;
          state.selectedPickup.userAddress.longitude =
            action.payload.updatedAddress.longitude;
        }
      })
      .addCase(updateAddressLatLng.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(updateTrackingStatus.fulfilled, (state, action) => {
        const updatedStatus = action.payload?.updatedPickup.trackingStatus;
        if (state.selectedPickup && updatedStatus) {
          state.selectedPickup.trackingStatus = updatedStatus;
        }
      })
      .addCase(updateTrackingStatus.rejected, (state, action) => {
        state.error = action.payload?.message as string;
      });
  },
});

export const { updatePickupCompletnStatus } = driverPickupSlice.actions;
export default driverPickupSlice.reducer;
