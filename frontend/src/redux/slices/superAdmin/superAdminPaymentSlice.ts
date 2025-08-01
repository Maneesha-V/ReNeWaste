import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { getPaymentHistory } from "../../../services/superAdmin/paymentService";
import { PaginationPayload } from "../../../types/common/commonTypes";
import {
  SubscriptionPaymentHisDTO,
  SubscriptionPaymentHisResult,
} from "../../../types/subscriptionPayment/paymentTypes";

interface PaymentsState {
  loading: boolean;
  error: string | null;
  success: boolean;
  payments: SubscriptionPaymentHisDTO[];
  total: number;
}

const initialState: PaymentsState = {
  loading: false,
  error: null,
  success: false,
  payments: [],
  total: 0,
};
export const fetchPaymentHistory = createAsyncThunk<
  SubscriptionPaymentHisResult,
  PaginationPayload,
  { rejectValue: { message: string } }
>(
  "superAdminPayments/fetchPaymentHistory",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await getPaymentHistory({ page, limit, search });
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ message: msg });
    }
  }
);
const superAdminPaymentsSlice = createSlice({
  name: "superAdminPayments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentHistory.fulfilled, (state, action) => {
        console.log("action", action.payload);
        const { paymentHis, total } = action.payload;
        state.loading = false;
        state.payments = paymentHis;
        state.total = total;
      })
      .addCase(fetchPaymentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default superAdminPaymentsSlice.reducer;
