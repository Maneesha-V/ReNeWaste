import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginWastePlant,
  logoutWastePlant,
  resendOtpService,
  resetPasswordService,
  sendOtpService,
  verifyOtpService,
} from "../../../services/wastePlant/authService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { LoginRequest } from "../../../types/user/userTypes";
import { LoginWPResp } from "../../../types/wasteplant/wastePlantTypes";
import { ResetPasswordReq, SendOtpError, VerifyOtpReq } from "../../../types/common/commonTypes";

interface WasteplantState {
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: WasteplantState = {
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const wastePlantLogin = createAsyncThunk<
LoginWPResp,
LoginRequest,
{ rejectValue: { message: string } }
>(
  "wasteplant/login",
  async (wastePlantData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginWastePlant(wastePlantData);
      console.log("res",response);
      
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
export const wastePlantLogout = createAsyncThunk<
null,
void,
{ rejectValue: { message: string } }
>(
  "wasteplant/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutWastePlant();
      return null;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
export const sendOtp = createAsyncThunk<
SendOtpError,
string,
{ rejectValue: SendOtpError }
>(
  "wasteplant/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await sendOtpService(email);
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
export const resendOtp = createAsyncThunk<
SendOtpError,
string,
{ rejectValue: SendOtpError }
>(
  "wasteplant/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtpService(email);
      console.log("res", response);
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
export const verifyOtp = createAsyncThunk<
SendOtpError,
VerifyOtpReq,
{ rejectValue: SendOtpError }
>(
  "wasteplant/verifyOtp",
  async (
    { email, otp }: VerifyOtpReq,
    { rejectWithValue }
  ) => {
    try {
      const response = await verifyOtpService(email, otp);
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
export const resetPassword = createAsyncThunk<
SendOtpError,
ResetPasswordReq,
{ rejectValue: SendOtpError }
>(
  "wasteplant/resetPassword",
  async (
    { email, password }: ResetPasswordReq,
    { rejectWithValue }
  ) => {
    try {
      const response = await resetPasswordService(email, password);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
       return rejectWithValue({ message: msg });
    }
  }
);
const wastePlantSlice = createSlice({
  name: "wasteplant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(wastePlantLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(wastePlantLogin.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(wastePlantLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(wastePlantLogout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(wastePlantLogout.rejected, (state, action) => {
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

export default wastePlantSlice.reducer;
