import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddMoneyReq,
  CreateWalletOrderResp,
  GetWalletWPResp,
  RetryAddMoneyResp,
  TransactionDTO,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
} from "../../../types/wallet/walletTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  addMoneyService,
  getWalletService,
  retryAddMoneyService,
  verifyWalletPaymentService,
} from "../../../services/wastePlant/walletService";
import { PaginationPayload } from "../../../types/common/commonTypes";

interface WalletState {
  loading: boolean;
  message: string | null;
  error: string | null;
  transactions: TransactionDTO[];
  balance: number;
  total: number;
  earnings: number;
}
const initialState: WalletState = {
  loading: false,
  message: null,
  error: null,
  transactions: [],
  balance: 0,
  total: 0,
  earnings: 0,
};

export const getWallet = createAsyncThunk<
  GetWalletWPResp,
  PaginationPayload,
  { rejectValue: { error: string } }
>(
  "wastePlantWallet/getWallet",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getWalletService({ page, limit, search });
      console.log("response", response);
      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  },
);
export const createAddMoneyOrder = createAsyncThunk<
  CreateWalletOrderResp,
  AddMoneyReq,
  { rejectValue: { error: string } }
>("wastePlantWallet/createAddMoneyOrder", async (data, { rejectWithValue }) => {
  try {
    const response = await addMoneyService(data);
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});
export const verifyWalletAddPayment = createAsyncThunk<
  VerifyWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  { rejectValue: { error: string } }
>(
  "wastePlantWallet/verifyWalletAddPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await verifyWalletPaymentService(data);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  },
);
export const retryAddMoney = createAsyncThunk<
  RetryAddMoneyResp,
  string,
  { rejectValue: { error: string } }
>(
  "wastePlantWallet/retryAddMoney",
  async (transactionId, { rejectWithValue }) => {
    try {
      const response = await retryAddMoneyService(transactionId);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  },
);

const wastePlantWalletSlice = createSlice({
  name: "wastePlantWallet",
  initialState,
  reducers: {
    updateWPWalletTransactionStatus: (state, action) => {
      const { transaction, balance } = action.payload;
      state.balance = balance;
      state.transactions.unshift(transaction);
    },
    updateWPWalletRetryTransactionStatus: (state, action) => {
      const { transaction, balance, transactionId } = action.payload;
      state.balance = balance;
      const index = state.transactions.findIndex(
        (trans) => trans._id === transactionId,
      );
      if (index !== -1) {
        state.transactions[index] = transaction;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.balance = action.payload.balance;
        state.total = action.payload.total;
        state.earnings = action.payload.earnings;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(createAddMoneyOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddMoneyOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createAddMoneyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(retryAddMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retryAddMoney.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(retryAddMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export const {
  updateWPWalletTransactionStatus,
  updateWPWalletRetryTransactionStatus,
} = wastePlantWalletSlice.actions;

export default wastePlantWalletSlice.reducer;
