import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchWasteReportsService, filterReportsService } from "../../../services/wastePlant/reportService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { WasteReportFilter } from "../../../types/wasteplant/wastePlantTypes";
import { FetchWasteReportsResp, FilterWasteReportsResp } from "../../../types/wasteCollections/wasteCollectionTypes";


interface SubscriptionState {
  loading: boolean;
  error: string | null;
  success: boolean;
  wasteReports: any;
  filterReports: any;
}

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  success: false,
  wasteReports: [],
  filterReports: [],
};

export const filterWasteReports = createAsyncThunk<
FilterWasteReportsResp,
WasteReportFilter,
 { rejectValue: { message: string } }
>(
  "wastePlantReports/filterWasteReports",
  async (filter: WasteReportFilter, { rejectWithValue }) => {
    try {
      const response = await filterReportsService(filter.from, filter.to);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
          return rejectWithValue({ message: msg });
    }
  }
);

export const fetchWasteReports = createAsyncThunk<
FetchWasteReportsResp,
void,
 { rejectValue: { message: string } }
>(
  "wastePlantReports/fetchWasteReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchWasteReportsService();
      console.log("response",response);
      
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
          return rejectWithValue({ message: msg });
    }
  }
);
const wastePlantReportsSlice = createSlice({
  name: "wastePlantReports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(filterWasteReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterWasteReports.fulfilled, (state, action) => {
        console.log("act",action.payload);
        state.loading = false;
        state.filterReports = action.payload.reports;
      })
      .addCase(filterWasteReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
        .addCase(fetchWasteReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWasteReports.fulfilled, (state, action) => {
        console.log("act",action.payload);
        
        state.loading = false;
        state.wasteReports = action.payload.wasteReports;
      })
      .addCase(fetchWasteReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
  },
});

export default wastePlantReportsSlice.reducer;
