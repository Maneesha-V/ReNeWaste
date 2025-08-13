import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPaymentOrderService,
  getAllPaymentsService,
  repayService,
  verifyPaymentService,
} from "../../../services/user/paymentService";
import {
  CreatePaymentPayload,
  CreatePaymentResponse,
  PaymentSummary,
  ReturnGetAllPayments,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "../../../types/pickupReq/paymentTypes";
import { RepaymentOrderResponse } from "../../../types/pickupReq/paymentTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { PickupPlansResp } from "../../../types/pickupReq/pickupTypes";

interface PickupState {
  loading: boolean;
  repayLoading: boolean;
  message: string | null;
  error: string | null;
  payments: PaymentSummary[];
  paymentOrder: CreatePaymentResponse | null;
  repaymentOrder: RepaymentOrderResponse | null;
  pickup: PickupPlansResp | null;
  amount: number | null;
  total: number;
}

const initialState: PickupState = {
  loading: false,
  repayLoading: false,
  message: null,
  error: null,
  payments: [],
  paymentOrder: null,
  repaymentOrder: null,
  pickup: null,
  amount: null,
  total: 0,
};
export const createPaymentOrder = createAsyncThunk<
  CreatePaymentResponse,
  CreatePaymentPayload,
  { rejectValue: { error: string } }
>(
  "userPayment/createPaymentOrder",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await createPaymentOrderService(paymentData);
      console.log("response", response);

      return response;
    } catch (err) {
      console.error("err", err);
      // return rejectWithValue(
      //   error.response?.data || "Failed to create payment"
      // );
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);

export const verifyPayment = createAsyncThunk<
  VerifyPaymentResponse,
  VerifyPaymentPayload,
  { rejectValue: { error: string } }
>("userPayment/verifyPayment", async (paymentData, { rejectWithValue }) => {
  try {
    const response = await verifyPaymentService(paymentData);
    console.log("response", response);

    return response;
  } catch (err) {
    // return rejectWithValue(err.response?.data || "Verification failed");
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});

export const getAllPayments = createAsyncThunk<
  ReturnGetAllPayments,
  PaginationPayload,
  { rejectValue: { error: string } }
>("userPayment/getAllPayments", async ({ page, limit, search, filter }, { rejectWithValue }) => {
  try {
    const response = await getAllPaymentsService({page, limit, search, filter});
    console.log("response", response);
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});
export const repay = createAsyncThunk<
  RepaymentOrderResponse,
  { pickupReqId: string; amount: number },
  { rejectValue: { error: string } }
>("userPayment/repay", async ({ pickupReqId, amount }, { rejectWithValue }) => {
  try {
    console.log(pickupReqId, amount);

    const response = await repayService(pickupReqId, amount);
    return response;
  } catch (err) {
    console.log("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});

const userPaymentSlice = createSlice({
  name: "userPayment",
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    setPaymentData: (state, action) => {
      state.pickup = action.payload.pickup;
      state.amount = action.payload.amount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentOrder = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
        state.paymentOrder = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { error: string })?.error ||
          "Failed to create payment.";
      })
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Verification failed";
      })
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        console.log("actrttr",action.payload);
        
        state.loading = false;
        state.payments = action.payload.payments;
        state.total = action.payload.total;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { error: string })?.error ||
          "Fetch payments failed.";
      })
      .addCase(repay.pending, (state) => {
        state.repayLoading = true;
        state.error = null;
        state.repaymentOrder = null;
      })
      .addCase(repay.fulfilled, (state, action) => {
        state.repayLoading = false;
        state.repaymentOrder = action.payload;
      })
      .addCase(repay.rejected, (state, action) => {
        state.repayLoading = false;
        state.error = action.payload?.error || "Retry failed";
      });
  },
});

export const { setPaymentData, clearPaymentError } = userPaymentSlice.actions;

export default userPaymentSlice.reducer;
