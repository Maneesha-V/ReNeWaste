import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createDropSpotService, fetchDropSpotsService } from '../../../services/wastePlant/dropSpotService';

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

export const createDropSpot = createAsyncThunk(
  "wastePlantDropSpot/createDropSpot",
  async (dropSpotData: any, { rejectWithValue }) => {
    try {
      const response = await createDropSpotService(dropSpotData);
      console.log(response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || 'Failed to create drop spot'
      );
    }
  }
);
export const fetchDropSpots = createAsyncThunk(
  "wastePlantDropSpot/fetchDropSpots",
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

const wastePlantDropSpotSlice = createSlice({
  name: 'wastePlantDropSpot',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createDropSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createDropSpot.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createDropSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
         .addCase(fetchDropSpots.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(fetchDropSpots.fulfilled, (state, action) => {
              state.loading = false;
              state.dropSpots = action.payload;
            })
            .addCase(fetchDropSpots.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload as string;
            })
  },
});

export default wastePlantDropSpotSlice.reducer;
