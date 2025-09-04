import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginDriver, logoutDriver, resendOtpService, resetPasswordService, sendOtpService, verifyOtpService } from "../../../services/driver/authService";
import { LoginRequest, LoginResponse } from "../../../types/driver/driverTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { SendOtpError } from "../../../types/common/commonTypes";

interface DriverState {
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: DriverState = {
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const driverLogin = createAsyncThunk<
LoginResponse,
LoginRequest,
{ rejectValue: {message : string}}
>(
  "driver/login",
  async (driverData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginDriver(driverData);
      return response;
    } catch (error) {
        const msg = getAxiosErrorMessage(error);
       return rejectWithValue({ message: msg });
    }
  }
);
export const driverLogout = createAsyncThunk<
null,
void,
{ rejectValue: {message : string}}
>(
  "driver/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutDriver();
      return null;
    } catch (error) {
        const msg = getAxiosErrorMessage(error);
             return rejectWithValue({ message: msg });
    }
  }
);
export const sendOtp = createAsyncThunk<
SendOtpError,
string,
{ rejectValue: {message : string}}
>(
  "driver/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await sendOtpService(email);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
       return rejectWithValue({ message: msg });
    }
  }
);
export const resendOtp = createAsyncThunk<
SendOtpError,
string,
{ rejectValue: {message : string}}
>(
  "driver/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtpService(email);
      console.log("res", response);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
       return rejectWithValue({ message: msg });
    }
  }
);
export const verifyOtp = createAsyncThunk<
SendOtpError,
{ email: string; otp: string },
{ rejectValue: {message : string}}
>(
  "driver/verifyOtp",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOtpService(email, otp);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
       return rejectWithValue({ message: msg });
    }
  }
);
export const resetPassword = createAsyncThunk<
SendOtpError,
{ email: string; password: string },
{ rejectValue: {message : string}}
>(
  "driver/resetPassword",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordService(email, password);
      return response;
    } catch (error) {
      console.log("Reset password error:", error);
     const msg = getAxiosErrorMessage(error);
       return rejectWithValue({ message: msg });
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
      .addCase(driverLogin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(driverLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(driverLogout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(driverLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
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
        state.error = action.payload?.message as string;
      })
      .addCase(resendOtp.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.message = action.payload?.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      })
  },
});

export default driverSlice.reducer;
