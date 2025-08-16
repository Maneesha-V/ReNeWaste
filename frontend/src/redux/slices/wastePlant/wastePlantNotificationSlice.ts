import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotifications,
  markAsReadService,
  saveWasteMeasurementService,
} from "../../../services/wastePlant/notificationService";
import { NotificationResp } from "../../../types/notification/notificationTypes";
import { SaveWasteMeasurementPayload } from "../../../types/wasteCollections/wasteCollectionTypes";

interface NotificationState {
  notifications: NotificationResp[];
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
  measuredNotificationId: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
  saveLoading: false,
  measuredNotificationId: null,
};

export const fetchNotifications = createAsyncThunk(
  "wastePlantNotifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotifications();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications."
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "wastePlantNotifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await markAsReadService(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to mark as read.");
    }
  }
);

export const saveWasteMeasurement = createAsyncThunk(
  "wastePlantNotifications/saveWasteMeasurement",
  async (data: SaveWasteMeasurementPayload, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const response = await saveWasteMeasurementService(data);
      console.log("response", response);
      return response;
    } catch (error: any) {
      console.error("err", error);
      return rejectWithValue(
        error.response?.data || "Failed to measure weight."
      );
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
        const notification = state.notifications.find(
          (n) => n._id === updatedId
        );
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(saveWasteMeasurement.pending, (state) => {
        state.saveLoading = true;
        state.measuredNotificationId = null;
      })
      .addCase(saveWasteMeasurement.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.saveLoading = false;
        // state.measuredNotificationId = action.payload.data.notificationId;
        state.measuredNotificationId = action.payload.data.notificationId;
        const notification = state.notifications.find(
          (n) => n._id === action.payload.data.notificationId
        );
        if (notification) {
          (notification as any).isMeasured = true;
        }
      })
      .addCase(saveWasteMeasurement.rejected, (state, action) => {
        state.saveLoading = false;
        state.measuredNotificationId = null;
        state.error = action.payload as string;
      });
  },
});

export const { addNotification } =
  wastePlantNotificationSlice.actions;
export default wastePlantNotificationSlice.reducer;
