import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  cancelSubPayReqById,
  fetchSubscriptionPlanService,
  fetchSubscriptionPlansService,
} from "../../../services/wastePlant/subscriptionService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  FetchSubsptnPlanResp,
  FetchSubsptnPlansResp,
  PlantData,
  SubsptnPlans,
} from "../../../types/subscription/subscriptionTypes";
import {
  SubscptnCancelReq,
  SubscptnCancelResp,
  SubscriptionPaymentHisDTO,
} from "../../../types/subscriptionPayment/paymentTypes";

interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  // selectedPlan: SelectedPlan | null;
  subscriptionData: SubsptnPlans | null;
  plantData: PlantData | null;
  subscriptionPlans: SubsptnPlans[];
  subPaymentsHis: SubscriptionPaymentHisDTO[];
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,
  // selectedPlan: null,
  subscriptionData: null,
  plantData: null,
  subscriptionPlans: [],
  subPaymentsHis: [],
};

export const fetchSubscriptionPlan = createAsyncThunk<
  FetchSubsptnPlanResp,
  void,
  { rejectValue: { error: string } }
>(
  "wastePlantSubscription/fetchSubscriptionPlan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchSubscriptionPlanService();
      console.log("responsettttt", response);

      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
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

export const cancelSubPayReq = createAsyncThunk<
  SubscptnCancelResp,
  SubscptnCancelReq,
  { rejectValue: { error: string } }
>(
  "wastePlantSubscription/cancelSubPayReq ",
  async ({ subPayId, reason }, { rejectWithValue }) => {
    try {
      const response = await cancelSubPayReqById({ subPayId, reason });
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
const wastePlantSubscriptionSlice = createSlice({
  name: "wastePlantSubscription",
  initialState,
  reducers: {
    updateSubPaymentStatus: (state, action) => {
      const { subPayId, expiredAt }  = action.payload;
      state.subPaymentsHis = state.subPaymentsHis.map((p) => {
        if (p._id === subPayId) {
          return { ...p, status: "Paid" };
        }
        return p;
      });
      // if (state.selectedPlan?.plantData) {
      //   state.selectedPlan.plantData.status = "Active";
      //   state.selectedPlan.plantData.expiredAt = expiredAt;
      // }
      if (state.plantData) {
        state.plantData.status = "Active";
        state.plantData.expiredAt = expiredAt;
      }
    },
    updateCancelSubdptnButtton: (state,action) => {
      const { subPayId } = action.payload;
      state.subPaymentsHis = state.subPaymentsHis.map((p) => {
        if(p._id === subPayId){
          return {...p, refundRequested: true}
        }
        return p;
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlan.fulfilled, (state, action) => {
        console.log("act", action.payload);
        state.loading = false;
        // state.selectedPlan = action.payload.selectedPlan;
        state.subscriptionData = action.payload.selectedPlan.subscriptionData;
        state.plantData = action.payload.selectedPlan.plantData;
        state.subPaymentsHis = action.payload.subPaymentHistory.paymentData;
      })
      .addCase(fetchSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        console.log("act-subsc", action.payload);
        state.loading = false;
        state.subscriptionPlans = action.payload.subscriptionPlans;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(cancelSubPayReq.rejected, (state, action) => {
        state.error = action.payload?.error as string;
      });
  },
});

export const { updateSubPaymentStatus, updateCancelSubdptnButtton } = wastePlantSubscriptionSlice.actions;
export default wastePlantSubscriptionSlice.reducer;
