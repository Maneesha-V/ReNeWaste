import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getEditProfile,
  getProfile,
  updateUserProfile,
} from "../../../services/user/profileService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { FetchUserResp, UserProfileReq, UserResp } from "../../../types/user/userTypes";
import { MsgResponse } from "../../../types/common/commonTypes";

interface UserState {
  user: UserResp | null;
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
export const fetchUserProfile = createAsyncThunk<
  FetchUserResp,
  void,
  { rejectValue: { message: string } }
>("userProfile/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await getProfile();
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});
export const updateProfile = createAsyncThunk<
MsgResponse,
UserProfileReq,
{ rejectValue: { message: string } }
>(
  "userProfile/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(data);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
      // return thunkAPI.rejectWithValue(
      //   error.response?.data?.message || "Failed to update user profile"
      // );
    }
  }
);
export const getUserEditProfile = createAsyncThunk<
FetchUserResp,
void,
{ rejectValue: { message: string } }
>(
  "userProfile/getUserEditProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEditProfile();
      return response;
    } catch (err) {
       const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
      // return thunkAPI.rejectWithValue(
      //   error.response?.data?.message || "Failed to fetch user edit profile"
      // );
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
        state.error = action.payload?.message as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      });
  },
});

export default userProfileSlice.reducer;
