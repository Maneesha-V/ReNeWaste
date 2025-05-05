import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchDriversService, getDriverProfile, updateProfile } from "../../../services/driver/profileService";
import { UpdateDriverArgs } from "../../../types/driverTypes";

interface DriverState {
  driver: any;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: DriverState = {
  driver: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

  export const fetchDriverProfile = createAsyncThunk(
    'driverProfile/fetchProfile',
    async (_, thunkAPI) => {
      try {
        const response = await getDriverProfile();
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch driver profile');
      }
    }
  );
  export const updateDriverProfile = createAsyncThunk(
    "driverProfile/updateProfile",
    async ({ data }: UpdateDriverArgs, thunkAPI) => {
      console.log(data);
      
      try {
        const response = await updateProfile(data); 
        return response;
      } catch (error: any) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to update driver profile"
        );
      }
    }
  );
  export const fetchDrivers = createAsyncThunk(
    'driverProfile/fetchDrivers',
    async (wastePlantId: string, { rejectWithValue }) => {
      try {
        const response = await fetchDriversService(wastePlantId)
        return response.data;
      } catch(error: any){
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch drivers"
        );
      }
    }
  );
const driverProfileSlice = createSlice({
    name: "driverProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDriverProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchDriverProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.driver = action.payload.driver;
        })
        .addCase(fetchDriverProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(updateDriverProfile.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateDriverProfile.fulfilled, (state, action) => {
          state.loading = false;
          state.driver = action.payload.driver;
        })
        .addCase(updateDriverProfile.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(fetchDrivers.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchDrivers.fulfilled, (state, action) => {
          state.loading = false;
          state.driver = action.payload;
        })
        .addCase(fetchDrivers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default driverProfileSlice.reducer;