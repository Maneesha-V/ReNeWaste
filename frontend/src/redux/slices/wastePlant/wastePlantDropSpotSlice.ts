import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createDropSpotService,
  deleteDropSpotServive,
  fetchDropSpotByIdService,
  fetchDropSpotsService,
  updateDropSpotServive,
} from "../../../services/wastePlant/dropSpotService";
import { DropSpotFormValues } from "../../../types/dropSpotTypes";
import { PaginationPayload } from "../../../types/common/commonTypes";


interface DropSpotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  dropSpots: any;
  selectedDropSpot: any;
  total: number;
}

const initialState: DropSpotState = {
  loading: false,
  error: null,
  success: false,
  dropSpots: [],
  selectedDropSpot: null,
  total: 0,
};

export const createDropSpot = createAsyncThunk(
  "wastePlantDropSpot/createDropSpot",
  async (dropSpotData: any, { rejectWithValue }) => {
    try {
      const response = await createDropSpotService(dropSpotData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to create drop spot"
      );
    }
  }
);
export const fetchDropSpots = createAsyncThunk(
  "wastePlantDropSpot/fetchDropSpots",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchDropSpotsService({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch drop spots."
      );
    }
  }
);
export const fetchDropSpotById = createAsyncThunk(
  "wastePlantDropSpot/fetchDropSpotById",
  async (dropSpotId: string, { rejectWithValue }) => {
    try {
      const response = await fetchDropSpotByIdService(dropSpotId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch drop spot by id."
      );
    }
  }
);
export const deleteDropSpot = createAsyncThunk(
  "wastePlantDropSpot/deleteDropSpot ",
  async (dropSpotId: string, thunkAPI) => {
    try {
      const response = await deleteDropSpotServive(dropSpotId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to delete drop spot."
      );
    }
  }
);
export const updateDropSpot = createAsyncThunk(
  "wastePlantDropSpot/updateDropSpot",
  async ({ dropSpotId, data }: { dropSpotId: string; data: DropSpotFormValues }, thunkAPI) => {
    try {
       const response = await updateDropSpotServive(dropSpotId, data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const wastePlantDropSpotSlice = createSlice({
  name: "wastePlantDropSpot",
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
        state.dropSpots = action.payload.dropspots;
        state.total = action.payload.total;
      })
      .addCase(fetchDropSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDropSpotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropSpotById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("act",action);
        
        state.selectedDropSpot = action.payload;
      })
      .addCase(fetchDropSpotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDropSpot.fulfilled, (state, action) => {
        state.dropSpots = state.dropSpots.filter(
          (dropSpot: any) => dropSpot._id !== action.payload
        );
      })
      .addCase(updateDropSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDropSpot.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDropSpot = action.payload;
      })
      .addCase(updateDropSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default wastePlantDropSpotSlice.reducer;
