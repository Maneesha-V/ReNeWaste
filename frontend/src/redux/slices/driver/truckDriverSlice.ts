import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAvaialbleTrucks, reqTruck } from "../../../services/driver/truckService";

interface TruckState {
    trucks: any;
    hasRequestedTruck: boolean;
    loading: boolean;
    message: string | null;
    error: string | null;
  }
  
  const initialState: TruckState = {
    trucks: [],
    hasRequestedTruck: false,
    loading: false,
    message: null,
    error: null,
  };
  export const fetchDriverTrucks= createAsyncThunk(
    "driverTrucks/fetchDriverTrucks",
    async ( driverId: string , { rejectWithValue }
    ) => {
      try {
        const response = await getAvaialbleTrucks(driverId);
        console.log("resp",response);
        
        return response;
      } catch (error: any) {
        console.error("err",error)
        return rejectWithValue(error.response?.data || "Failed to fetch trucks for driver.");
      }
    }
  );
  export const reqTruckByDriver= createAsyncThunk(
    "driverTrucks/reqTruckByDriver",
    async ( _, { rejectWithValue }
    ) => {
      try {
        const response = await reqTruck();
        console.log("resp",response);
        
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to send truck req to drver.");
      }
    }
  );
  const driverTruckSlice = createSlice({
    name: "driverTrucks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDriverTrucks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchDriverTrucks.fulfilled, (state, action) => {
          state.loading = false;
          state.trucks = action.payload;
        })
        .addCase(fetchDriverTrucks.rejected, (state, action) => { 
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(reqTruckByDriver.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(reqTruckByDriver.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.hasRequestedTruck = true; 
        })
        .addCase(reqTruckByDriver.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
    },
});

export default driverTruckSlice.reducer;