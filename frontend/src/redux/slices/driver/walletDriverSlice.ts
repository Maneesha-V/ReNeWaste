import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { TransactionDTO } from "../../../types/wallet/walletTypes";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { getWalletService } from "../../../services/driver/walletService";

interface WalletState {
    loading: boolean;
    message: string | null;
    error: string | null;
    transactions: TransactionDTO[] | [];
    balance: number;
    total: number;
    rewards: number;
  }
  const initialState: WalletState = {
    loading: false,
    message: null,
    error: null,
    transactions: [],
    balance: 0,
    total: 0,
    rewards: 0,
  };
  
  export const getWallet = createAsyncThunk<
    any,
    PaginationPayload,
    { rejectValue: { error: string } }
  >("driverWallet/getWallet", async (
    { page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getWalletService({ page, limit, search });
      console.log("response", response);
      return response;
    } catch (err) {
      console.error("err", err);
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  });
  
  const driverWalletSlice = createSlice({
    name: "driverWallet",
    initialState,
    reducers: {},
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
          state.rewards = action.payload.rewards;
        })
        .addCase(getWallet.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.error as string;
        });
    },
  });
  
  export default driverWalletSlice.reducer;