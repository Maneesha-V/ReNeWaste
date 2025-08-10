import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsersService, toggleUserBlockStatusService } from "../../../services/wastePlant/userService";
import { PaginationPayload } from "../../../types/common/commonTypes";

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  users: any;
  total: number;
}

const initialState: UserState = {
  loading: false,
  error: null,
  success: false,
  users: [],
  total: 0,
};

export const fetchUsers = createAsyncThunk(
  "wastePlantUser/fetchUsers",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchUsersService({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch users."
      );
    }
  }
);
export const toggleUserBlockStatus = createAsyncThunk(
  "wastePlantUser/toggleUserBlockStatus",
  async ({ userId, isBlocked }: { userId: string; isBlocked: boolean }, thunkAPI) => {
    try {
      const response = await toggleUserBlockStatusService(userId, isBlocked);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || "Something went wrong");
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
        state.error = action.payload as string;
      })
      .addCase(toggleUserBlockStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserBlockStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex((u: any) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(toggleUserBlockStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wastePlantUserSlice.reducer;
