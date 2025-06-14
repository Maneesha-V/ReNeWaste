
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSubscriptionPlanService } from "../../../services/wastePlant/subscriptionService";

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  selectedPlan: any;
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,
  selectedPlan: [],
};

export const fetchSubscriptionPlan = createAsyncThunk(
  "wastePlantSubscription/fetchSubscriptionPlan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionPlanService();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch fetch Subscription Plan."
      );
    }
  }
);

const wastePlantSubscriptionSlice = createSlice({
  name: "wastePlantSubscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlan.fulfilled, (state, action) => {
        console.log("act",action.payload);
        
        state.loading = false;
        state.selectedPlan = action.payload.selectedPlan;
      })
      .addCase(fetchSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default wastePlantSubscriptionSlice.reducer;
