import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cancelUserPickup, getUserPickups } from "../../../services/user/pickupService";

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
  async (_, { rejectWithValue }
  ) => {
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
  async (pickupReqId: string, { rejectWithValue }
  ) => {
    try {
      const response = await cancelUserPickup(pickupReqId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to cancel pickup");
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
      });
},
});

export default userPickupSlice.reducer;
