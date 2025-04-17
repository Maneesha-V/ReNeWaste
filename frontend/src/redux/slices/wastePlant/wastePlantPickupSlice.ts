import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPickups } from "../../../services/wastePlant/pickupService";


interface PickupState {
  pickups: any;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: PickupState = {
  pickups: [],
  loading: false,
  message: null,
  error: null,
};
export const fetchPickupReqsts = createAsyncThunk(
    "wastePlantPickup/fetchPickupReqsts",
    async ( wasteType: "Residential" | "Commercial", { rejectWithValue }) => {
      try {
        const response = await getPickups(wasteType);
        return response;
      } catch (error: any) {
        return rejectWithValue(
          error.response?.data || "Failed to fetch pickups"
        );
      }
    }
  );
  const wastePlantPickupSlice = createSlice({
    name: "wastePlantPickup",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchPickupReqsts.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPickupReqsts.fulfilled, (state, action) => {
          state.loading = false;
          state.pickups = action.payload;
        })
        .addCase(fetchPickupReqsts.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
    },
  });
  
  export default wastePlantPickupSlice.reducer;