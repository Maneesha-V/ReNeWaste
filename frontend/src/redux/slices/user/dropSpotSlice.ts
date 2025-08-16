import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDropSpotsService } from "../../../services/user/dropSpotService";
import {
  FetchDropSpotResp,
  UserDropSpot,
} from "../../../types/dropspots/dropSpotTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";

interface DropSpotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  dropSpots: UserDropSpot[];
}

const initialState: DropSpotState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  dropSpots: [],
};

export const fetchNearDropSpots = createAsyncThunk<
  FetchDropSpotResp,
  void,
  { rejectValue: { message: string } }
>("userDropSpot/fetchNearDropSpots", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchDropSpotsService();
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

const userDropSpotSlice = createSlice({
  name: "userDropSpot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearDropSpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearDropSpots.fulfilled, (state, action) => {
        state.loading = false;
        state.dropSpots = action.payload.dropspots;
        state.message = action.payload.message;
      })
      .addCase(fetchNearDropSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default userDropSpotSlice.reducer;
