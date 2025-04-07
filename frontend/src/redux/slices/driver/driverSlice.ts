import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginRequest } from "../../../types/authTypes";
import { loginDriver } from "../../../services/driver/authService";

interface DriverState {
  driver: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: DriverState = {
  driver: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const driverLogin = createAsyncThunk(
  "driver/login",
  async (driverData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginDriver(driverData);

      localStorage.setItem("token", response.token);
      return response;
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(error);
    }
  }
);
const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(driverLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(driverLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
      })
      .addCase(driverLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    //   .addCase(wastePlantLogout.fulfilled, (state) => {
    //     state.wasteplant = null;
    //     state.loading = false;
    //     state.error = null;
    //   })
    //   .addCase(wastePlantLogout.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
    //   .addCase(sendOtp.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //     state.message = null;
    //   })
    //   .addCase(sendOtp.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.message = action.payload?.message;
    //   })
    //   .addCase(sendOtp.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
    //   .addCase(resendOtp.pending, (state) => {
    //     state.error = null;
    //     state.message = null;
    //   })
    //   .addCase(resendOtp.fulfilled, (state, action) => {
    //     state.message = action.payload?.message;
    //   })
    //   .addCase(resendOtp.rejected, (state, action) => {
    //     state.error = action.payload as string;
    //   })
    //   .addCase(verifyOtp.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(verifyOtp.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.message = action.payload?.message;
    //     state.error = null;
    //   })
    //   .addCase(verifyOtp.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
    //   .addCase(resetPassword.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //     state.message = null;
    //   })
    //   .addCase(resetPassword.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.message = action.payload?.message;
    //   })
    //   .addCase(resetPassword.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export default driverSlice.reducer;
