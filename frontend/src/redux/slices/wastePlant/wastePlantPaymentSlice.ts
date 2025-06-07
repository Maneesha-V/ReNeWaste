import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchPaymentsService } from "../../../services/wastePlant/paymentService";

interface PaymentState {
  loading: boolean;
  error: string | null;
  success: boolean;
  payments: any;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  success: false,
  payments: [],
};

export const fetchPayments = createAsyncThunk(
  "wastePlantPayments/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchPaymentsService();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch payments."
      );
    }
  }
);

const wastePlantPaymentSlice = createSlice({
  name: "wastePlantPayments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload.paymentData;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default wastePlantPaymentSlice.reducer;
