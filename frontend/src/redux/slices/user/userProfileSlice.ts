import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getEditProfile,
  getProfile,
  updateUserProfile,
} from "../../../services/user/profileService";
import { UserProfile } from "../../../types/profileTypes";

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
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getProfile();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile"
      );
    }
  }
);
export const updateProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (data: UserProfile ,thunkAPI) => {
    try {
      const response = await updateUserProfile(data);
      return response;
    } catch (error: any) {
      console.error("err",error)
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update user profile"
      );
    }
  }
);
export const getUserEditProfile = createAsyncThunk(
  "userProfile/getUserEditProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getEditProfile();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user edit profile"
      );
    }
  }
);
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserEditProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEditProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserEditProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;
