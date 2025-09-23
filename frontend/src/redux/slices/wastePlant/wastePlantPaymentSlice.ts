import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPaymentOrderService,
  fetchPaymentsService,
  getAllPayments,
  repayService,
  triggerPickupRefundService,
  updateRefundStatusService,
  verifyPaymentService,
} from "../../../services/wastePlant/paymentService";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  RefundPaymntPayload,
  RefundPaymntResp,
  RefundStatusUpdateResp,
  UpdateStatusPayload,
} from "../../../types/pickupReq/paymentTypes";
import { FetchSubscrptnPayments, PaymentOrder, RetryPaymentData, RetrySubptnPaymntResp, SubCreatePaymtResp, SubptnVerifyPaymenReq, SubptnVerifyPaymenResp } from "../../../types/subscriptionPayment/paymentTypes";
import { FetchPaymentsResp } from "../../../types/wasteplant/wastePlantTypes";

interface PaymentState {
  message: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  payments: any;
  paymentOrder: PaymentOrder | null;
  repaymentOrder: {} | null;
  total: number;
  updatedStatus: {};
}

const initialState: PaymentState = {
  message: null,
  loading: false,
  error: null,
  success: false,
  payments: [],
  paymentOrder: null,
  repaymentOrder: null,
  total: 0,
  updatedStatus: {},
};

export const fetchPayments = createAsyncThunk<
FetchPaymentsResp,
PaginationPayload,
{ rejectValue: {message: string}}
>(
  "wastePlantPayments/fetchPayments",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchPaymentsService({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
           return rejectWithValue({ message: msg });
    }
  }
);


export const createSubscriptionOrder = createAsyncThunk<
SubCreatePaymtResp,
string,
{ rejectValue: {error: string} }
>(
  "wastePlantPayments/createSubscriptionOrder",
  async (
     planId: string ,
    { rejectWithValue }
  ) => {
    try {
      const response = await createPaymentOrderService(planId);
      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const verifySubscriptionPayment = createAsyncThunk<
SubptnVerifyPaymenResp,
SubptnVerifyPaymenReq,
{ rejectValue: {error: string} }
>(
  "wastePlantPayments/verifySubscriptionPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await verifyPaymentService(paymentData);
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const fetchSubscrptnPayments = createAsyncThunk<
FetchSubscrptnPayments,
void,
{ rejectValue: {error: string} }
>(
  "wastePlantPayments/fetchSubscrptnPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPayments();
      console.log("respons", response);

      return response;
    } catch (err) {
            const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const repay = createAsyncThunk<
RetrySubptnPaymntResp,
RetryPaymentData,
{ rejectValue: {error : string}}
>(
  "wastePlantPayments/repay",
  async ({ planId, amount, subPaymtId }, { rejectWithValue }) => {
    try {
      const response = await repayService({ planId, amount, subPaymtId });
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const updateRefundStatus = createAsyncThunk<
  RefundStatusUpdateResp,
  UpdateStatusPayload,
  { rejectValue: { error: string } }
>(
  "wastePlantPayments/updateRefundStatus",
  async ({ pickupReqId, status }, { rejectWithValue }) => {
    try {
      const response = await updateRefundStatusService({ pickupReqId, status });
      console.log("response", response);

      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
      // return rejectWithValue(err.response?.data || "Fetch payments failed");
    }
  }
);

export const triggerPickupRefund = createAsyncThunk<
RefundPaymntResp,
RefundPaymntPayload,
{ rejectValue: { error: string } }
>(
  "wastePlantPayments/triggerPickupRefund",
  async (
    { pickupReqId, amount, razorpayPaymentId }: RefundPaymntPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await triggerPickupRefundService({
        pickupReqId,
        amount,
        razorpayPaymentId,
      });
      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
const wastePlantPaymentSlice = createSlice({
  name: "wastePlantPayments",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
        state.total = action.payload.total;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(createSubscriptionOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentOrder = null;
      })
      .addCase(createSubscriptionOrder.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        state.paymentOrder = action.payload.paymentOrder;
      })
      .addCase(createSubscriptionOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { error: string })?.error;
      })
      .addCase(verifySubscriptionPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
        console.log("action",action.payload);
        state.loading = false;
        state.message = action.payload.message;
        localStorage.setItem("wasteplant_status","Active");
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(fetchSubscrptnPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.payments = null;
      })
      .addCase(fetchSubscrptnPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments.paymentData;
      })
      .addCase(fetchSubscrptnPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(repay.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.repaymentOrder = null;
      })
      .addCase(repay.fulfilled, (state, action) => {
        state.loading = false;
        console.log("action", action.payload);

        state.repaymentOrder = action.payload;
      })
      .addCase(repay.rejected, (state, action) => {
        state.loading = false;
       state.error = (action.payload as { error: string })?.error;
      })
      .addCase(updateRefundStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRefundStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter((p: any) => {
          const {_id, refundStatus, inProgressExpiresAt } = action.payload.statusUpdate;
          if (p._id === _id) {
            p.refundStatus = refundStatus;
            p.inProgressExpiresAt = inProgressExpiresAt;
          }
        });
        // state.updatedStatus = action.payload.payment;
      })
      .addCase(updateRefundStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { error: string })?.error;
      })

      .addCase(triggerPickupRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.refundOrder = null;
      })
      .addCase(triggerPickupRefund.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        // state.refundOrder = action.payload.refundOrder;
      })
      .addCase(triggerPickupRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export const { clearPaymentError } = wastePlantPaymentSlice.actions;

export default wastePlantPaymentSlice.reducer;
