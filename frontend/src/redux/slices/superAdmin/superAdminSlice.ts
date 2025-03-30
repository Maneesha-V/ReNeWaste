import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LoginRequest } from "../../../types/authTypes";
import { loginSuperAdmin } from "../../../services/superAdmin/authService";

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
    async (superAdminData: LoginRequest, {rejectWithValue}) => {
      try {
        const response = await loginSuperAdmin(superAdminData);
        localStorage.setItem("token", response.token); 
        return response;
      } catch (error: any) {
        console.error("err",error)
        return rejectWithValue(error);
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
    
    },
  });
  
  export default superAdminSlice.reducer;