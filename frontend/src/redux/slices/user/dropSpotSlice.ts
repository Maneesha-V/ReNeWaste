import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDropSpotsService } from '../../../services/user/dropSpotService';

interface DropSpotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  dropSpots: any;
}

const initialState: DropSpotState = {
  loading: false,
  error: null,
  success: false,
  dropSpots: [],
};

export const fetchNearDropSpots = createAsyncThunk(
  "userDropSpot/fetchNearDropSpots",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchDropSpotsService();
      console.log("ress",response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch drop spots."
      );
    }
  }
);

const userDropSpotSlice = createSlice({
  name: 'userDropSpot',
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
              state.dropSpots = action.payload;
            })
            .addCase(fetchNearDropSpots.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
            })
  },
});

export default userDropSpotSlice.reducer;
