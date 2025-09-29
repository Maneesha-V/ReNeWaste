import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  addMoneyService,
  getWalletService,
  retryAddMoneyService,
  verifyWalletPaymentService,
} from "../../../services/user/walletService";
import {
  AddMoneyReq,
  CreateWalletOrderResp,
  GetWalletResp,
  RetryAddMoneyResp,
  VerifyWalletAddPaymentReq,
  VerifyWalletAddPaymentResp,
  WalletDTO,
} from "../../../types/wallet/walletTypes";


interface WalletState {
  loading: boolean;
  message: string | null;
  error: string | null;
  userWallet: WalletDTO | null
}
const initialState: WalletState = {
  loading: false,
  message: null,
  error: null,
  userWallet: null,
};

export const createAddMoneyOrder = createAsyncThunk<
  CreateWalletOrderResp,
  AddMoneyReq,
  { rejectValue: { error: string } }
>("userWallet/createAddMoneyOrder", async (data, { rejectWithValue }) => {
  try {
    const response = await addMoneyService(data);
    console.log("response", response);

    return response;
  } catch (err) {
    console.error("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});
export const verifyWalletAddPayment = createAsyncThunk<
  VerifyWalletAddPaymentResp,
  VerifyWalletAddPaymentReq,
  { rejectValue: { error: string } }
>("userWallet/verifyWalletAddPayment", async (data, { rejectWithValue }) => {
  try {
    const response = await verifyWalletPaymentService(data);
    console.log("response", response);

    return response;
  } catch (err) {
    console.error("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});
export const getWallet = createAsyncThunk<
  GetWalletResp,
  void,
  { rejectValue: { error: string } }
>("userWallet/getWallet", async (_, { rejectWithValue }) => {
  try {
    const response = await getWalletService();
    console.log("response", response);

    return response;
  } catch (err) {
    console.error("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});

export const retryAddMoney = createAsyncThunk<
  RetryAddMoneyResp,
  string,
  { rejectValue: { error: string } }
>("userWallet/retryAddMoney", async (transactionId, { rejectWithValue }) => {
  try {
    const response = await retryAddMoneyService(transactionId);
    console.log("response", response);

    return response;
  } catch (err) {
    console.error("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});
const userWalletSlice = createSlice({
  name: "userWallet",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAddMoneyOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAddMoneyOrder.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
      })
      .addCase(createAddMoneyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
        state.userWallet = action.payload.userWallet;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
        .addCase(retryAddMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retryAddMoney.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
      })
      .addCase(retryAddMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
  },
});

export default userWalletSlice.reducer;
