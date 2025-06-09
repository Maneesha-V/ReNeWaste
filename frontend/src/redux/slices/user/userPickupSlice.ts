import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelPickupReqById,
  cancelUserPickup,
  getUserPickups,
} from "../../../services/user/pickupService";
import { PickupCancelData } from "../../../types/wastePlantTypes";

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
export const fetchtPickupPlans = createAsyncThunk(
  "userPickups/fetchtPickupPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserPickups();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch pickups");
    }
  }
);
export const cancelPickupPlan = createAsyncThunk(
  "userPickups/cancelPickupPlan",
  async (pickupReqId: string, { rejectWithValue }) => {
    try {
      const response = await cancelUserPickup(pickupReqId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to cancel pickup");
    }
  }
);
export const cancelPickupReq = createAsyncThunk(
  "userPickups/cancelPickupReq ",
  async ({ pickupReqId, reason }: PickupCancelData, thunkAPI) => {
    try {
      const response = await cancelPickupReqById({ pickupReqId, reason });
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to cancel pickupreq."
      );
    }
  }
);

const userPickupSlice = createSlice({
  name: "userPickups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchtPickupPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchtPickupPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload;
      })
      .addCase(fetchtPickupPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelPickupPlan.rejected, (state, action) => {
        state.error = action.payload as string;
      })
    .addCase(cancelPickupReq.fulfilled, (state, action) => {
      console.log("act",action.payload);
      
      state.pickups = state.pickups.filter(
        
        
        (pickups: any) => {
          console.log("pi",pickups);
          pickups._id !== action.payload
        }
      );
    })
  },
});

export default userPickupSlice.reducer;
