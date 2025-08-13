import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  cancelPickupReqById,
  cancelUserPickup,
  getUserPickups,
} from "../../../services/user/pickupService";
import {
  PickupCancelData,
  PickupCancelDataResp,
  PickupPlansResp,
  PickupPlansResponse,
} from "../../../types/pickupReq/pickupTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { MsgResponse, PaginationPayload } from "../../../types/common/commonTypes";

interface PickupState {
  pickups: PickupPlansResp[];
  selectedPickup: any;
  eta: string | null;
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: PickupState = {
  pickups: [],
  selectedPickup: null,
  eta: null,
  loading: false,
  message: null,
  error: null,
  total: 0,
};
export const fetchtPickupPlans = createAsyncThunk<
  PickupPlansResponse,
  PaginationPayload,
  { rejectValue: { error: string } }
>(
  "userPickups/fetchtPickupPlans",
  async ({ page, limit, search, filter }, { rejectWithValue }) => {
    try {
      const response = await getUserPickups({ page, limit, search, filter });
      console.log("response", response);

      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const cancelPickupPlan = createAsyncThunk<
  MsgResponse,
  string,
  { rejectValue: { error: string } }
>(
  "userPickups/cancelPickupPlan",
  async (pickupReqId: string, { rejectWithValue }) => {
    try {
      const response = await cancelUserPickup(pickupReqId);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
      // return rejectWithValue(error.response?.data || "Failed to cancel pickup");
    }
  }
);
export const cancelPickupReq = createAsyncThunk<
PickupCancelDataResp,
PickupCancelData,
 { rejectValue: { error: string } }
>(
  "userPickups/cancelPickupReq ",
  async ({ pickupReqId, reason }, { rejectWithValue }) => {
    try {
      const response = await cancelPickupReqById({ pickupReqId, reason });
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);

const userPickupSlice = createSlice({
  name: "userPickups",
  initialState,
  reducers: {
    updatePickupPaymentStatus: (state, action) => {
      const { pickupReqId, updatedPayment } = action.payload;
      const index = state.pickups.findIndex(
        (p: PickupPlansResp) => p._id === pickupReqId
      );
      if (index !== -1) {
        state.pickups[index].payment = updatedPayment;
      }
    },
    updateCancelPickupStatus: (state, action) => {
      const { pickupReqId } = action.payload;
      const index = state.pickups.findIndex(
        (p: PickupPlansResp) => p._id === pickupReqId
      );
      if(index !== -1){
        state.pickups[index].status = "Cancelled"
      }
    },
    updateCancelPickupReason: (state,action) => {
      const { pickupReqId, payment } = action.payload;
            const index = state.pickups.findIndex(
        (p: PickupPlansResp) => p._id === pickupReqId
      );
      if(index !== -1){
        state.pickups[index].payment = payment
      }
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchtPickupPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.pickups = [];
      })
      .addCase(fetchtPickupPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.pickups = action.payload.pickups;
        state.total = action.payload.total;
      })
      .addCase(fetchtPickupPlans.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { error: string })?.error ||
          "Fetch pickup plans failed.";
      })
      .addCase(cancelPickupPlan.rejected, (state, action) => {
        state.error =
          (action.payload as { error: string })?.error ||
          "Failed to cancel pickup.";
      })
      .addCase(cancelPickupReq.rejected, (state, action) => {
        state.error =
          (action.payload as { error: string })?.error ||
          "Failed to cancel pickup with reason.";
      })
  },
});

export const { 
  updatePickupPaymentStatus, updateCancelPickupStatus, updateCancelPickupReason 
} = userPickupSlice.actions;

export default userPickupSlice.reducer;



