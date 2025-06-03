import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getNotifications, markAsReadService } from "../../../services/wastePlant/notificationService";
import { Notification } from "../../../types/notificationTypes"

interface NotificationState {
    notifications: Notification[],
    loading: boolean,
    error: string | null,
  }
  
  const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null,
  };

  export const fetchNotifications = createAsyncThunk(
    "wastePlantNotifications/fetchNotifications",
    async (_ , { rejectWithValue }
    ) => {
      try {
        const response = await getNotifications();
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch notifications.");
      }
    }
  );

  export const markAsRead = createAsyncThunk(
    "wastePlantNotifications/markAsRead",
    async (id:string , { rejectWithValue }
    ) => {
      try {
        const response = await markAsReadService(id);
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to mark as read.");
      }
    }
  );

  const wastePlantNotificationSlice = createSlice({
  name: "wastePlantNotifications",
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
        state.error = action.payload as string;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
      const updatedId = action.payload._id;
      const notification = state.notifications.find(n => n._id === updatedId);
      if (notification) {
        notification.isRead = true;
      }
    })
    .addCase(markAsRead.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { addNotification } = wastePlantNotificationSlice.actions;
export default wastePlantNotificationSlice.reducer;