import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LoginRequest,
  SignupSuperAdminRequest,
} from "../../../types/authTypes";
import {
  loginSuperAdmin,
  logoutSuperAdmin,
  signupSuperAdmin,
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

export const superAdminLogin = createAsyncThunk(
  "superadmin/login",
  async (superAdminData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await loginSuperAdmin(superAdminData);
      localStorage.setItem("token", response.token);
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
      localStorage.setItem("token", response.token);
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
      localStorage.removeItem("token");
      return null;
    } catch (error: any) {
      return rejectWithValue("Logout failed. Please try again.");
    }
  }
);

const superAdminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default superAdminSlice.reducer;
