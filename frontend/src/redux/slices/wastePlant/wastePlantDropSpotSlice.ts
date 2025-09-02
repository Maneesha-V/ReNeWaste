import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createDropSpotService,
  deleteDropSpotServive,
  fetchDropSpotByIdService,
  fetchDropSpotsService,
  updateDropSpotServive,
} from "../../../services/wastePlant/dropSpotService";
import { MsgSuccessResp, PaginationPayload } from "../../../types/common/commonTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { DelDropSpotResp, DropSpotDTO, DropSpotFormValues, FetchDropSpotResp, updatedDropSpotResp, updateDropSpotReq } from "../../../types/dropspots/dropSpotTypes";

interface DropSpotState {
  loading: boolean;
  error: string | null;
  success: boolean;
  dropSpots: DropSpotDTO[];
  selectedDropSpot: DropSpotDTO | null;
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

export const createDropSpot = createAsyncThunk<
  MsgSuccessResp,
  DropSpotFormValues,
  { rejectValue: { message: string } }
>(
  "wastePlantDropSpot/createDropSpot",
  async (dropSpotData, { rejectWithValue }) => {
    try {
      const response = await createDropSpotService(dropSpotData);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchDropSpots = createAsyncThunk<
FetchDropSpotResp,
PaginationPayload,
 { rejectValue: { message: string } }
>(
  "wastePlantDropSpot/fetchDropSpots",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await fetchDropSpotsService({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchDropSpotById = createAsyncThunk<
DropSpotDTO,
string,
{ rejectValue: { message: string } }
>(
  "wastePlantDropSpot/fetchDropSpotById",
  async (dropSpotId: string, { rejectWithValue }) => {
    try {
      const response = await fetchDropSpotByIdService(dropSpotId);
      return response;
    } catch (error) {
       const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const deleteDropSpot = createAsyncThunk<
DelDropSpotResp,
string,
{ rejectValue: { message: string } }
>(
  "wastePlantDropSpot/deleteDropSpot ",
  async (dropSpotId: string, { rejectWithValue }) => {
    try {
      const response = await deleteDropSpotServive(dropSpotId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const updateDropSpot = createAsyncThunk<
updatedDropSpotResp,
updateDropSpotReq,
{ rejectValue: { message: string } }
>(
  "wastePlantDropSpot/updateDropSpot",
  async (
    updateData,
    { rejectWithValue }
  ) => {
    try {
      const response = await updateDropSpotServive(updateData);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

const wastePlantDropSpotSlice = createSlice({
  name: "wastePlantDropSpot",
  initialState,
  reducers: {
    updateDelDropSpot: (state, action) => {
      console.log("deln",action);
      const dropSpotId = action.payload._id;
      state.dropSpots.filter(d => d._id !== dropSpotId)
    }
  },
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
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      })
      .addCase(fetchDropSpotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropSpotById.fulfilled, (state, action) => {
        state.loading = false;
        console.log("act", action);
        state.selectedDropSpot = action.payload;
      })
      .addCase(fetchDropSpotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(deleteDropSpot.fulfilled, (state, action) => {
        state.dropSpots = state.dropSpots.filter(
          (dropSpot: DropSpotDTO) => dropSpot._id !== action.payload.dropspot._id
        );
      })
      .addCase(updateDropSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDropSpot.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDropSpot = action.payload.updatedDropSpot;
      })
      .addCase(updateDropSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export const { updateDelDropSpot } =
  wastePlantDropSpotSlice.actions;

export default wastePlantDropSpotSlice.reducer;
