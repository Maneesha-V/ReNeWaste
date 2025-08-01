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
import {
  RefundPaymntPayload,
  retryPaymentData,
  SubptnVerifyPaymentPayload,
} from "../../../types/paymentTypes";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  RefundStatusUpdateResp,
  UpdateStatusPayload,
} from "../../../types/pickupReq/paymentTypes";
import { RetrySubptnPaymntResp, SubCreatePaymtResp, subPaymnetPayload } from "../../../types/subscriptionPayment/paymentTypes";

interface PaymentState {
  message: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  payments: any;
  paymentOrder: any | null;
  repaymentOrder: any | null;
  total: number;
  updatedStatus: {};
  refundOrder: any | null;
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
  refundOrder: null,
};

export const fetchPayments = createAsyncThunk(
  "wastePlantPayments/fetchPayments",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchPaymentsService({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch payments."
      );
    }
  }
);
export const createSubscriptionOrder = createAsyncThunk<
SubCreatePaymtResp,
subPaymnetPayload,
{ rejectValue: {error: string} }
>(
  "wastePlantPayments/createSubscriptionOrder",
  async (
    { amount, planId, plantName },
    { rejectWithValue }
  ) => {
    try {
      const response = await createPaymentOrderService({
        amount,
        planId,
        plantName,
      });
      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
      // return rejectWithValue(
      //   error.response?.data || "Failed to create payment"
      // );
    }
  }
);
export const verifySubscriptionPayment = createAsyncThunk(
  "wastePlantPayments/verifySubscriptionPayment",
  async (paymentData: SubptnVerifyPaymentPayload, { rejectWithValue }) => {
    try {
      const response = await verifyPaymentService(paymentData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Verification failed");
    }
  }
);
export const fetchSubscrptnPayments = createAsyncThunk(
  "wastePlantPayments/fetchSubscrptnPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPayments();
      console.log("response", response);

      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetch payments failed");
    }
  }
);
export const repay = createAsyncThunk<
RetrySubptnPaymntResp,
retryPaymentData,
{ rejectValue: {error : string}}
>(
  "wastePlantPayments/repay",
  async ({ planId, amount, subPaymtId }, { rejectWithValue }) => {
    try {
      const response = await repayService({ planId, amount, subPaymtId });
      return response;
    } catch (err) {
      // return rejectWithValue(err.response?.data || "Fetch payments failed");
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

export const triggerPickupRefund = createAsyncThunk(
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
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(error.response?.data || "Failed to create refund");
    }
  }
);
const wastePlantPaymentSlice = createSlice({
  name: "wastePlantPayments",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
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
        state.error = action.payload as string;
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
      .addCase(verifySubscriptionPayment.fulfilled, (state) => {
        state.loading = false;
        state.message = "Payment verified successfully";
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSubscrptnPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.payments = null;
      })
      .addCase(fetchSubscrptnPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.payments;
      })
      .addCase(fetchSubscrptnPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
          if (p._id === action.payload._id) {
            p.refundStatus = action.payload.refundStatus;
            p.inProgressExpiresAt = action.payload.inProgressExpiresAt;
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
        state.refundOrder = null;
      })
      .addCase(triggerPickupRefund.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        state.refundOrder = action.payload.refundOrder;
      })
      .addCase(triggerPickupRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError } = wastePlantPaymentSlice.actions;

export default wastePlantPaymentSlice.reducer;
