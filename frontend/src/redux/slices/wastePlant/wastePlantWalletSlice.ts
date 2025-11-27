import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetWalletWPResp, TransactionDTO } from "../../../types/wallet/walletTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { getWalletService } from "../../../services/wastePlant/walletService";
import { PaginationPayload } from "../../../types/common/commonTypes";

interface WalletState {
  loading: boolean;
  message: string | null;
  error: string | null;
  transactions: TransactionDTO[] | [];
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
>("wastePlantWallet/getWallet", async (
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

const wastePlantWalletSlice = createSlice({
  name: "wastePlantWallet",
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
        state.earnings = action.payload.earnings;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      });
  },
});

export default wastePlantWalletSlice.reducer;
