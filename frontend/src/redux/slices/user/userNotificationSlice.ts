import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  markAsReadService,
} from "../../../services/user/notificationService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { NotificationResp } from "../../../types/notification/notificationTypes";

interface NotificationState {
  notifications: NotificationResp[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  NotificationResp[],
  void,
  { rejectValue: { message: string } }
>("userNotifications/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const response = await getNotifications();
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const markAsRead = createAsyncThunk<
  NotificationResp,
  string,
  { rejectValue: { message: string } }
>("userNotifications/markAsRead", async (id, { rejectWithValue }) => {
  try {
    const response = await markAsReadService(id);
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

const userNotificationSlice = createSlice({
  name: "userNotifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        console.log("action", action.payload);

        const updatedId = action.payload._id;
        const notification = state.notifications.find(
          (n) => n._id === updatedId
        );
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to read notification.";
      });
  },
});

export const { addNotification } = userNotificationSlice.actions;
export default userNotificationSlice.reducer;
