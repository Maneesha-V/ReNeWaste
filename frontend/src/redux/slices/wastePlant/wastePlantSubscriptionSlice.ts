
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchSubscriptionPlanService, fetchSubscriptionPlansService } from "../../../services/wastePlant/subscriptionService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { FetchSubsptnPlansResp, SubsptnPlans } from "../../../types/subscription/subscriptionTypes";

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  selectedPlan: any;
  subscriptionPlans: SubsptnPlans[];
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,
  selectedPlan: [],
  subscriptionPlans: [],
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
export const fetchSubscriptionPlans = createAsyncThunk<
FetchSubsptnPlansResp,
void,
{ rejectValue: { message: string } }
>(
  "wastePlantSubscription/fetchSubscriptionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionPlansService();
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
            return rejectWithValue({ message: msg });
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
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        console.log("act-subsc",action.payload);
        state.loading = false;
        state.subscriptionPlans = action.payload.subscriptionPlans;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
  },
});

export default wastePlantSubscriptionSlice.reducer;
