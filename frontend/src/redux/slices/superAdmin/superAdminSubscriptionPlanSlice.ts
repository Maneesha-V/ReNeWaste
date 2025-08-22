import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSubscriptionPlanService,
  deleteSubscriptionPlanById,
  getSubscriptionPlans,
  getSubscrptionPlanById,
  updateSubscriptionPlanById,
} from "../../../services/superAdmin/subscriptionService";
import {
  DelSubsptnPlansResp,
  FetchSubsptnPlanByIdResp,
  FetchSubsptnPlansResp,
  SubsptnPlans,
  updateSubscptnReq,
  updateSubscptnResp,
} from "../../../types/subscription/subscriptionTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { MsgSuccessResp, PaginationPayload } from "../../../types/common/commonTypes";

interface SubsptnPlanState {
  loading: boolean;
  error: string | null;
  message: string | null;
  success: boolean;
  subscriptionPlans: SubsptnPlans[];
  subscriptionPlan: SubsptnPlans;
  total: number;
}

const initialState: SubsptnPlanState = {
  loading: false,
  error: null,
  message: null,
  success: false,
  subscriptionPlans: [],
  subscriptionPlan: {},
  total: 0,
};

export const createSubscriptionPlan = createAsyncThunk<
  MsgSuccessResp,
  SubsptnPlans,
  { rejectValue: { message: string } }
>(
  "superAdminSubscriptionPlan/createSubscriptionPlan",
  async (subscptnPlanData, { rejectWithValue }) => {
    try {
      const response = await createSubscriptionPlanService(subscptnPlanData);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

export const fetchSubscriptionPlans = createAsyncThunk<
  FetchSubsptnPlansResp,
  PaginationPayload,
  { rejectValue: { message: string } }
>(
  "superAdminSubscriptionPlan/fetchSubscriptionPlans",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await getSubscriptionPlans({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

export const deleteSubscriptionPlan = createAsyncThunk<
  DelSubsptnPlansResp,
  string,
  { rejectValue: { message: string } }
>(
  "superAdminSubscriptionPlan/deleteSubscriptionPlan",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteSubscriptionPlanById(id);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

export const fetchSubscriptionPlanById = createAsyncThunk<
  FetchSubsptnPlanByIdResp,
  string,
  { rejectValue: { message: string } }
>(
  "superAdminSubscriptionPlan/fetchSubscriptionPlanById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSubscrptionPlanById(id);
      console.log("response", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk<
  updateSubscptnResp,
  updateSubscptnReq,
  { rejectValue: { message: string } }
>(
  "superAdminSubscriptionPlan/updateSubscriptionPlan",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateSubscriptionPlanById({ id, data });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
const superAdminSubscriptionPlanSlice = createSlice({
  name: "superAdminSubscriptionPlan",
  initialState,
  reducers: {
    updateDeleteSubscription: (state, action) => {
      const planId = action.payload;
      state.subscriptionPlans = state.subscriptionPlans.filter(
        (s: SubsptnPlans) => s._id !== planId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        console.log("aaccc",action.payload);
        
        state.loading = false;
        state.subscriptionPlans = action.payload.subscriptionPlans;
        state.total = action.payload.total;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchSubscriptionPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlan = action.payload.subscriptionPlan;
      })
      .addCase(fetchSubscriptionPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.message = action.payload?.message;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export const { updateDeleteSubscription } = superAdminSubscriptionPlanSlice.actions;
export default superAdminSubscriptionPlanSlice.reducer;
