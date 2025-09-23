import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  approvePickupService,
  cancelPickupReqById,
  getAvailableDriversByPlace,
  getPickups,
  reschedulePickupService,
} from "../../../services/wastePlant/pickupService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { PickupCancelData, PickupReqDTO } from "../../../types/pickupReq/pickupTypes";
import { ApprovePickupPayload, ApprovePickupResp, FetchDriversByPlaceResp, FetchPickupReqParams, FetchPickupResp, PickupCancelResp, ReschedulePickupResp } from "../../../types/wasteplant/wastePlantTypes";
import { DriverDTO } from "../../../types/driver/driverTypes";

interface PickupState {
  pickups: PickupReqDTO[] | [];
  pickup: PickupReqDTO | {};
  driver: DriverDTO[] | [];
  loading: boolean;
  message: string | null;
  error: string | null;
  approveError: string | null;
}

const initialState: PickupState = {
  pickups: [],
  pickup: {},
  driver: [],
  loading: false,
  message: null,
  error: null,
  approveError: null,
};
export const fetchPickupReqsts = createAsyncThunk<
FetchPickupResp,
FetchPickupReqParams,
{rejectValue: {error: string}}

>(
  "wastePlantPickup/fetchPickupReqsts",
  async (
    params,
    { rejectWithValue }
  ) => {
    try {
      const response = await getPickups(params);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ error: msg });
    }
  }
);
export const approvePickup = createAsyncThunk<
ApprovePickupResp,
ApprovePickupPayload,
{rejectValue: {error: string}}
>(
  "wastePlantPickup/approvePickup",
  async (
    {
      pickupReqId,
      pickupId,
      status,
      driverId,
      assignedTruckId,
    }: ApprovePickupPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await approvePickupService(
        pickupReqId,
        pickupId,
        status,
        driverId,
        assignedTruckId
      );
      return response;
    } catch (error) {
      console.error("err", error);
        const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ error: msg });
    }
  }
);
export const reschedulePickup = createAsyncThunk<
ReschedulePickupResp,
any,
{rejectValue: {error: string}}
>(
  "wastePlantPickup/reschedulePickup ",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await reschedulePickupService(formData);
      return response;
    } catch (error) {
        const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ error: msg });
    }
  }
);
export const cancelPickupReq = createAsyncThunk<
PickupCancelResp,
PickupCancelData,
{rejectValue: {error: string}}
>(
  "wastePlantPickup/cancelPickupReq ",
  async ({ pickupReqId, reason }: PickupCancelData, { rejectWithValue }) => {
    try {
      const response = await cancelPickupReqById({ pickupReqId, reason });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ error: msg });
    }
  }
);
export const fetchDriversByPlace = createAsyncThunk<
FetchDriversByPlaceResp,
string,
{rejectValue: {error: string}}
>(
  "wastePlantPickup/fetchDriversByPlace ",
  async (location: string, { rejectWithValue }) => {
    try {
      const response = await getAvailableDriversByPlace(location);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ error: msg });
    }
  }
);
const wastePlantPickupSlice = createSlice({
  name: "wastePlantPickup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPickupReqsts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPickupReqsts.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload.pickups;
      })
      .addCase(fetchPickupReqsts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(approvePickup.pending, (state) => {
        state.loading = true;
        state.approveError = null;
      })
      .addCase(approvePickup.fulfilled, (state) => {
        state.loading = false;
        // state.driver = action.payload.;
      })
      .addCase(approvePickup.rejected, (state, action) => {
        state.loading = false;
        state.approveError = action.payload?.error as string;
      })
      .addCase(reschedulePickup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reschedulePickup.fulfilled, (state, action) => {
        state.loading = false;
        state.pickup = action.payload.updatedPickup;
      })
      .addCase(reschedulePickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(cancelPickupReq.fulfilled, (state, action) => {
        state.pickups = state.pickups.filter(
          (pickups: PickupReqDTO) => pickups._id !== action.payload.result._id
        );
      })
      .addCase(fetchDriversByPlace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriversByPlace.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload.drivers;
      })
      .addCase(fetchDriversByPlace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export default wastePlantPickupSlice.reducer;
