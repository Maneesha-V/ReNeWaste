import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createPaymentOrderService, getAllPaymentsService, repayService, verifyPaymentService } from "../../../services/user/paymentService";
import { VerifyPaymentPayload } from "../../../types/paymentTypes";

interface PickupState {
  loading: boolean;
  message: string | null;
  error: string | null;
  payments: any;
  paymentOrder: any | null;
  repaymentOrder: any | null;
  pickup: any | null;
  amount: number | null;
}

const initialState: PickupState = {
  loading: false,
  message: null,
  error: null,
  payments: [],
  paymentOrder: null, 
  repaymentOrder: null, 
  pickup: null,
  amount: null,
};
export const createPaymentOrder = createAsyncThunk(
  "userPayment/createPaymentOrder",
  async ({ amount, pickupReqId }: { amount: number; pickupReqId: string }, { rejectWithValue }
  ) => {
    try {
      const response = await createPaymentOrderService(amount, pickupReqId);
      return response;
    } catch (error: any) {
      console.error("err",error);
      return rejectWithValue(error.response?.data || "Failed to create payment");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "userPayment/verifyPayment",
  async (paymentData:VerifyPaymentPayload , { rejectWithValue }) => {
    try {
      const response = await verifyPaymentService(paymentData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Verification failed");
    }
  }
);

export const getAllPayments = createAsyncThunk(
  "userPayment/getAllPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPaymentsService();
      console.log("response",response);
      
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetch payments failed");
    }
  }
);
export const repay = createAsyncThunk(
  "userPayment/repay",
  async ({ pickupReqId, amount }: { pickupReqId: string, amount: number }, { rejectWithValue }) => {
    try {
      console.log(pickupReqId, amount);
      
      const response = await repayService(pickupReqId, amount);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Fetch payments failed");
    }
  }
);
const userPaymentSlice = createSlice({
  name: "userPayment",
  initialState,
  reducers: {
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
        state.loading = false;
        state.paymentOrder = action.payload.paymentOrder;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.message = "Payment verified successfully";
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
        .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
         state.payments = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
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
        console.log("action",action.payload);
        
        state.repaymentOrder = action.payload;
      })
      .addCase(repay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setPaymentData } = userPaymentSlice.actions;

export default userPaymentSlice.reducer;