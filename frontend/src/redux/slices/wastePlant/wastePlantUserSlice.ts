import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsersService, toggleUserBlockStatusService } from "../../../services/wastePlant/userService";
import { PaginationPayload } from "../../../types/common/commonTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { UserResp } from "../../../types/user/userTypes";
import { FetchUsers, ToggleUserBlockStatusResp } from "../../../types/wasteplant/wastePlantTypes";

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  users: UserResp[] | [];
  total: number;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  users: [],
  total: 0,
};

export const fetchUsers = createAsyncThunk<
FetchUsers,
PaginationPayload,
{ rejectValue: {message: string}}
>(
  "wastePlantUser/fetchUsers",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchUsersService({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const toggleUserBlockStatus = createAsyncThunk<
ToggleUserBlockStatusResp,
{ userId: string; isBlocked: boolean },
{ rejectValue: {message: string}}
>(
  "wastePlantUser/toggleUserBlockStatus",
  async ({ userId, isBlocked }: { userId: string; isBlocked: boolean }, { rejectWithValue }) => {
    try {
      const response = await toggleUserBlockStatusService(userId, isBlocked);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

const wastePlantUserSlice = createSlice({
  name: "wastePlantUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(toggleUserBlockStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserBlockStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.updatedUser;
        const index = state.users.findIndex((u: UserResp) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(toggleUserBlockStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default wastePlantUserSlice.reducer;
