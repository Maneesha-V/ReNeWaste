import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  approvePickupService,
  cancelPickupReqById,
  getPickups,
  getScheduledPickups,
  reschedulePickupService,
} from "../../../services/wastePlant/pickupService";
import { ApprovePickupPayload } from "../../../types/pickupTypes";

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
export const fetchPickupReqsts = createAsyncThunk(
  "wastePlantPickup/fetchPickupReqsts",
  async (
    params: {
      wasteType: "Residential" | "Commercial";
      status: "Pending" | "Scheduled" | "Completed" | "Cancelled" | "Rescheduled";
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getPickups(params.wasteType, params.status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch pickups");
    }
  }
);
export const approvePickup = createAsyncThunk(
  "wastePlantPickup/approvePickup",
  async (
    {
      pickupReqId,
      pickupId,
      status,
      driverId,
      assignedZone,
    }: ApprovePickupPayload,
    thunkAPI
  ) => {
    try {
      const response = await approvePickupService(
        pickupReqId,
        pickupId,
        status,
        driverId,
        assignedZone
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to approve pickup"
      );
    }
  }
);
export const reschedulePickup  = createAsyncThunk(
  "wastePlantPickup/reschedulePickup ",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await reschedulePickupService(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Something wrong."
      );
    }
  }
);
export const cancelPickupReq = createAsyncThunk(
  "wastePlantDriver/cancelPickupReq ",
  async ({ pickupReqId, status }: { pickupReqId: string, status: string },thunkAPI) => {
    try {
      const response = await cancelPickupReqById(pickupReqId, status);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
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
        state.pickups = action.payload;
      })
      .addCase(fetchPickupReqsts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(reschedulePickup .pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reschedulePickup .fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
      })
      .addCase(reschedulePickup .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelPickupReq.fulfilled, (state, action) => {
        state.pickups = state.pickups.filter(
          (pickups: any) => pickups._id !== action.payload
        );
      });
  },
});

export default wastePlantPickupSlice.reducer;
