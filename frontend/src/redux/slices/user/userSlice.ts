import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signupUser, loginUser, logoutUser, sendOtpService, verifyOtpService, resetPasswordService, googleSignUpService, googleSignInService, resendOtpService } from "../../../services/user/authService";
import { SignupRequest, LoginRequest, GoogleLoginReq } from "../../../types/authTypes";
import { auth, googleProvider } from "../../../config/firebase";

interface UserState {
  user: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const signup = createAsyncThunk(
  "user/signup",
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await signupUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Signup failed. Please try again.");
    }
  }
);
export const login = createAsyncThunk(
  "user/login",
  async (userData: LoginRequest, {rejectWithValue}) => {
    try {
      const response = await loginUser(userData);
      localStorage.setItem("token", response.token); 
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
export const logout = createAsyncThunk(
  "user/logout", 
  async (_, { rejectWithValue }) => {
  try {
    await logoutUser();
    localStorage.removeItem("token"); 
    return null; 
  } catch (error: any) {
    return rejectWithValue("Logout failed. Please try again.");
  }
});

export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async(email: string, { rejectWithValue }) => {
    try{
      const response = await sendOtpService(email);
      return response;
    }catch(error: any){   
      return rejectWithValue(error || "Failed to send OTP.")
    }
  }
)
export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await resendOtpService(email)
      console.log("res",response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Failed to resend OTP");
    }
  }
);
export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async({ email, otp }: { email: string; otp: string }, {rejectWithValue}) => {
    try{
      const response = await verifyOtpService(email,otp)
      return response;
    }catch(error: any){
      console.log("OTP verification error:", error);  
      return rejectWithValue(error.message || "OTP verification failed")
    }
  }
)
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async( {email, password}: {email:string,password: string} , { rejectWithValue }) => {
    try{
      const response = await resetPasswordService(email,password);
      return response;
    }catch(error: any){
      console.log("Reset password error:", error);  
      return rejectWithValue(error.response?.data?.message || "Failed to reset password");
    }
  }
)
export const googleSignUp = createAsyncThunk(
  "user/googleSignUp",
  async(_,{ rejectWithValue }) => {
    try {
      const response = await googleSignUpService(auth, googleProvider)
      return response.data;
    } catch(error: any) {
      console.log("Google Sign-Up error:", error);  
      return rejectWithValue(error.response?.data?.message || "Google Sign-Up Failed");
    }
  }
)
export const googleLogin = createAsyncThunk<any,GoogleLoginReq,{rejectValue: string}>(
  "user/googleLogin",
  async(userData: GoogleLoginReq,{ rejectWithValue }) => {
    try {
      const response = await googleSignInService(userData)
      console.log("resppp",response);
      
      return response;
    } catch(error: any) {
      console.log("Google Sign-In error:", error);  
      return rejectWithValue(error || "Google Sign-In Failed");
    }
  }
)
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
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null; 
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
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
        // state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        // state.loading = false;
        state.message = action.payload?.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        // state.loading = false;
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
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;