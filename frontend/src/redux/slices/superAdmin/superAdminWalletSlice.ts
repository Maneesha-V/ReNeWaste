import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetWalletSAResp, TransactionDTO } from "../../../types/wallet/walletTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { getWalletService } from "../../../services/superAdmin/walletService";

interface WalletState {
  loading: boolean;
  message: string | null;
  error: string | null;
  transactions: TransactionDTO[] | [];
  balance: number;
  total: number;
}
const initialState: WalletState = {
  loading: false,
  message: null,
  error: null,
  transactions: [],
  balance: 0,
  total: 0,
};

export const getWallet = createAsyncThunk<
  GetWalletSAResp,
  PaginationPayload,
  { rejectValue: { error: string } }
>("superAdminWallet/getWallet", async (
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

const superAdminWalletSlice = createSlice({
  name: "superAdminWallet",
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
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export default superAdminWalletSlice.reducer;
