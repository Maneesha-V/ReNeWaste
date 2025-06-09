import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SubsptnPlanData, updateSubscptnData } from "../../../types/subscriptionTypes";
import {
  createSubscriptionPlanService,
  deleteSubscriptionPlanById,
  getSubscriptionPlans,
  getSubscrptionPlanById,
  updateSubscriptionPlanById,
} from "../../../services/superAdmin/subscriptionService";

interface DropSpotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  subscriptionPlans: any;
}

const initialState: DropSpotState = {
  loading: false,
  error: null,
  success: false,
  subscriptionPlans: [],
};

export const createSubscriptionPlan = createAsyncThunk(
  "superAdminSubscriptionPlan/createSubscriptionPlan",
  async (subscptnPlanData: SubsptnPlanData, { rejectWithValue }) => {
    try {
      const response = await createSubscriptionPlanService(subscptnPlanData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to create SubscriptionPlan"
      );
    }
  }
);

export const fetchSubscriptionPlans = createAsyncThunk(
  "superAdminSubscriptionPlan/fetchSubscriptionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionPlans();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch SubscriptionPlans."
      );
    }
  }
);

export const deleteSubscriptionPlan  = createAsyncThunk(
  "superAdminSubscriptionPlan/deleteSubscriptionPlan",
  async (id: string, thunkAPI) => {
    try {
      const response = await deleteSubscriptionPlanById(id)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Failed to delete plan.");
    }
  }
)

export const fetchSubscriptionPlanById = createAsyncThunk(
  "superAdminSubscriptionPlan/fetchSubscriptionPlanById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getSubscrptionPlanById(id)
      console.log("response",response);
      
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  "superAdminSubscriptionPlan/updateSubscriptionPlan",
  async ({ id, data }: updateSubscptnData, thunkAPI) => {
    try {
      const response = await updateSubscriptionPlanById({id, data})
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Failed to update data.");
    }
  }
)
const superAdminSubscriptionPlanSlice = createSlice({
  name: "superAdminSubscriptionPlan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlans = action.payload.subscriptionPlans;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(fetchSubscriptionPlanById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
      state.loading = false;
      state.subscriptionPlans = action.payload;
    })
    .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
     .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
            state.subscriptionPlans = state.subscriptionPlans.filter((plan: any) => plan._id !== action.payload);
          })
            .addCase(updateSubscriptionPlan.pending, (state) => {
                  state.loading = true;
                  state.error = null;
                })
                .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
                  state.loading = false;
                  state.subscriptionPlans = action.payload;
                })
                .addCase(updateSubscriptionPlan.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload as string;
                })
  },
});

export default superAdminSubscriptionPlanSlice.reducer;
