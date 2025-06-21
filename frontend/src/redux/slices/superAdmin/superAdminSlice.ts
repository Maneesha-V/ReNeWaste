import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LoginRequest,
  SignupSuperAdminRequest,
} from "../../../types/authTypes";
import {
  getRefreshAccessToken,
  loginSuperAdmin,
  logoutSuperAdmin,
  resendOtpService,
  resetPasswordService,
  sendOtpService,
  signupSuperAdmin,
  verifyOtpService,
} from "../../../services/superAdmin/authService";

interface SuperAdminState {
  superadmin: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: SuperAdminState = {
  superadmin: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const refreshAccessToken = createAsyncThunk(
  "superadmin/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRefreshAccessToken();    
      return response.token;
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(error);
    }
  }
);

export const superAdminLogin = createAsyncThunk(
  "superadmin/login",
  async (superAdminData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginSuperAdmin(superAdminData);
      return response;
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(error);
    }
  }
);

export const superAdminSignup = createAsyncThunk(
  "superadmin/signup",
  async (superAdminData: SignupSuperAdminRequest, { rejectWithValue }) => {
    try {
      const response = await signupSuperAdmin(superAdminData);
      return response;
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(error || "Failed to signup.");
    }
  }
);
export const superAdminLogout = createAsyncThunk(
  "superadmin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutSuperAdmin();
      return null;
    } catch (error: any) {
      return rejectWithValue("Logout failed. Please try again.");
    }
  }
);
export const sendOtp = createAsyncThunk(
  "superadmin/sendOtp",
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
  "superadmin/resendOtp",
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
  "superadmin/verifyOtp",
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
  "superadmin/resetPassword",
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

const superAdminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload;
        // localStorage.setItem("token", action.payload);
      })
      .addCase(superAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superAdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.superadmin = action.payload;
      })
      .addCase(superAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(superAdminSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superAdminSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.superadmin = action.payload;
      })
      .addCase(superAdminSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(superAdminLogout.fulfilled, (state) => {
        state.superadmin = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(superAdminLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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

export default superAdminSlice.reducer;
