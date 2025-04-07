import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginRequest } from "../../../types/authTypes";
import { loginDriver, resendOtpService, resetPasswordService, sendOtpService, verifyOtpService } from "../../../services/driver/authService";

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
export const sendOtp = createAsyncThunk(
  "driver/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await sendOtpService(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to send OTP.");
    }
  }
);
export const resendOtp = createAsyncThunk(
  "driver/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtpService(email);
      console.log("res", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to resend OTP"
      );
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "driver/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOtpService(email, otp);
      return response;
    } catch (error: any) {
      console.log("OTP verification error:", error);
      return rejectWithValue(error.message || "OTP verification failed");
    }
  }
);
export const resetPassword = createAsyncThunk(
  "driver/resetPassword",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordService(email, password);
      return response;
    } catch (error: any) {
      console.log("Reset password error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
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
      })
    //   .addCase(wastePlantLogout.fulfilled, (state) => {
    //     state.wasteplant = null;
    //     state.loading = false;
    //     state.error = null;
    //   })
    //   .addCase(wastePlantLogout.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   })
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resendOtp.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.message = action.payload?.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default driverSlice.reducer;
