import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { LoginRequest, LoginResponse, SignUpReq, SuperAdmin } from "../../../types/superadmin/superAdminTypes";
import { MsgResp, ResetPasswordReq, VerifyOtpReq } from "../../../types/common/commonTypes";

interface SuperAdminState {
  superadmin: SuperAdmin | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
  role: string | null;
}

const initialState: SuperAdminState = {
  superadmin: null,
  loading: false,
  error: null,
  message: null,
  token: null,
  role: null
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

// export const refreshAccessToken = createAsyncThunk<
//   TokenResp,
//   void,
//   { rejectValue: { message: string } }
// >("superadmin/refreshAccessToken", async (_, { rejectWithValue }) => {
//   try {
//     const response = await getRefreshAccessToken();
//     return response;
//   } catch (error) {
//     console.error("err", error);
//     const msg = getAxiosErrorMessage(error);
//     return rejectWithValue({ message: msg });
//   }
// });
export const superAdminLogin = createAsyncThunk<
LoginResponse,
LoginRequest,
{ rejectValue: { message: string } }
>(
  "superadmin/login",
  async (superAdminData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginSuperAdmin(superAdminData);
      return response;
    } catch (error) {
      console.error("err", error);
      const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
    }
  }
);

export const superAdminSignup = createAsyncThunk<
MsgResp,
SignUpReq,
{ rejectValue: { message: string } }
>(
  "superadmin/signup",
  async (superAdminData: SignUpReq, { rejectWithValue }) => {
    try {
      const response = await signupSuperAdmin(superAdminData);
      return response;
    } catch (error) {
      console.error("err", error);
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
    }
  }
);
export const superAdminLogout = createAsyncThunk<
null,
void,
{ rejectValue: { message: string } }
>(
  "superadmin/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutSuperAdmin();
      return null;
    } catch (error) {
        const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
    }
  }
);
export const sendOtp = createAsyncThunk<
MsgResp,
string,
{ rejectValue: { message: string } }
>(
  "superadmin/sendOtp",
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
MsgResp,
string,
{ rejectValue: { message: string } }
>(
  "superadmin/resendOtp",
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
MsgResp,
VerifyOtpReq,
{ rejectValue: { message: string } }
>(
  "superadmin/verifyOtp",
  async (
    { email, otp }: VerifyOtpReq,{ rejectWithValue }
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
MsgResp,
ResetPasswordReq,
{ rejectValue: { message: string } }
>(
  "superadmin/resetPassword",
  async (
    { email, password }: ResetPasswordReq,
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

const superAdminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        // state.token = action.payload;
        localStorage.setItem("token", action.payload);
      })
      .addCase(superAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superAdminLogin.fulfilled, (state) => {
        state.loading = false;
        // state.token = action.payload.token;
        // state.message = action.payload.message;
        // state.role = action.payload.role;
      })
      .addCase(superAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(superAdminSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superAdminSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(superAdminSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(superAdminLogout.fulfilled, (state) => {
        state.superadmin = null;
        state.loading = false;
        state.error = null;
        // state.token = null;
        // state.role = null;
      })
      .addCase(superAdminLogout.rejected, (state, action) => {
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
      });
  },
});

export default superAdminSlice.reducer;
