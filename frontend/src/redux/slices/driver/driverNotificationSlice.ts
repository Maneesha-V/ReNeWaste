import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  markAsReadService,
} from "../../../services/driver/notificationService";
import {
  FetchNotificationsResp,
  markAsReadResp,
  NotificationResp,
} from "../../../types/notification/notificationTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";

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
  FetchNotificationsResp,
  void,
  { rejectValue: { message: string } }
>("driverNotifications/fetchNotifications", async (_, { rejectWithValue }) => {
  try {
    const response = await getNotifications();
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const markAsRead = createAsyncThunk<
  markAsReadResp,
  string,
  { rejectValue: { message: string } }
>("driverNotifications/markAsRead", async (id: string, { rejectWithValue }) => {
  try {
    const response = await markAsReadService(id);
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

const driverNotificationSlice = createSlice({
  name: "driverNotifications",
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
        state.notifications = action.payload.notifications;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const updatedId = action.payload.updatedNotification._id;
        const notification = state.notifications.find(
          (n) => n._id === updatedId
        );
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload?.message as string;
      });
  },
});

export const { addNotification } = driverNotificationSlice.actions;
export default driverNotificationSlice.reducer;
