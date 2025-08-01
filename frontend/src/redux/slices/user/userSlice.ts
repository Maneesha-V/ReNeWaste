import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signupUser,
  loginUser,
  logoutUser,
  sendOtpService,
  verifyOtpService,
  resetPasswordService,
  googleSignUpService,
  googleSignInService,
  resendOtpService,
  sendOtpSignupService,
  resendOtpSignupService,
  verifyOtpSignupService,
} from "../../../services/user/authService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  GoogleLoginReq,
  GoogleLoginResp,
  LoginRequest,
  LoginResponse,
  SignupRequest,
} from "../../../types/user/userTypes";
import {
  GoogleSignUpArgs,
  GoogleSignUpResp,
  ResetPasswordReq,
  SendOtpError,
  VerifyOtpReq,
} from "../../../types/common/commonTypes";

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
  role: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  token: null,
  role: null
};

export const signup = createAsyncThunk(
  "user/signup",
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await signupUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Signup failed. Please try again."
      );
    }
  }
);
export const login = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: { message: string } }
>("user/login", async (userData: LoginRequest, { rejectWithValue }) => {
  try {
    const response = await loginUser(userData);
    return response;
  } catch (error) {
    console.log("err", error);
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const logout = createAsyncThunk<
  null,
  void,
  { rejectValue: { message: string } }
>("user/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    return null;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const sendOtpSignup = createAsyncThunk(
  "user/sendOtpSignup",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await sendOtpSignupService(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error || "Failed to send OTP.");
    }
  }
);
export const resendOtpSignup = createAsyncThunk(
  "user/resendOtpSignup",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtpSignupService(email);
      console.log("res", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to resend OTP"
      );
    }
  }
);
export const verifyOtpSignup = createAsyncThunk(
  "user/verifyOtpSignup",
  async (
    { email, otp }: { email: string; otp: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOtpSignupService(email, otp);
      return response;
    } catch (error: any) {
      console.log("OTP verification error:", error);
      return rejectWithValue(error.message || "OTP verification failed");
    }
  }
);
export const sendOtp = createAsyncThunk<
  SendOtpError,
  string,
  { rejectValue: SendOtpError }
>("user/sendOtp", async (email, { rejectWithValue }) => {
  try {
    const response = await sendOtpService(email);
    console.log("response", response);

    return response;
  } catch (error) {
    console.log("error", error);
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const resendOtp = createAsyncThunk<
  SendOtpError,
  string,
  { rejectValue: SendOtpError }
>("user/resendOtp", async (email, { rejectWithValue }) => {
  try {
    const response = await resendOtpService(email);
    console.log("res", response);
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const verifyOtp = createAsyncThunk<
  SendOtpError,
  VerifyOtpReq,
  { rejectValue: SendOtpError }
>(
  "user/verifyOtp",
  async ({ email, otp }: VerifyOtpReq, { rejectWithValue }) => {
    try {
      const response = await verifyOtpService(email, otp);
      return response;
    } catch (error) {
      console.log("OTP verification error:", error);
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const resetPassword = createAsyncThunk<
  SendOtpError,
  ResetPasswordReq,
  { rejectValue: SendOtpError }
>(
  "user/resetPassword",
  async ({ email, password }: ResetPasswordReq, { rejectWithValue }) => {
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
export const googleSignUp = createAsyncThunk<
  GoogleSignUpResp,
  GoogleSignUpArgs,
  { rejectValue: { message: string } }
>(
  "user/googleSignUp",
  async ({ auth, googleProvider }, { rejectWithValue }) => {
    try {
      const response = await googleSignUpService(auth, googleProvider);
      return response.data;
    } catch (error) {
      console.log("Google Sign-Up error:", error);
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const googleLogin = createAsyncThunk<
  GoogleLoginResp,
  GoogleLoginReq,
  { rejectValue: { message: string } }
>("user/googleLogin", async (userData: GoogleLoginReq, { rejectWithValue }) => {
  try {
    const response = await googleSignInService(userData);
    console.log("resppp", response);

    return response;
  } catch (error) {
    console.log("Google Sign-In error:", error);
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Login failed. Please try again.";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Logout failed. Please try again.";
      })
      .addCase(sendOtpSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendOtpSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(sendOtpSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resendOtpSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtpSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(resendOtpSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtpSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message;
        state.error = null;
      })
      .addCase(verifyOtpSignup.rejected, (state, action) => {
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
        state.error = null;
        state.message = action.payload?.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP.";
      })
      .addCase(resendOtp.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.message = action.payload?.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to resend OTP.";
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
        state.error = action.payload?.message || "Failed to verify OTP.";
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
        state.error = action.payload?.message || "Failed to reset password.";
      })
      .addCase(googleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed google signup.";
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload?.message || "Failed google signin.";
      });
  },
});

export default userSlice.reducer;
