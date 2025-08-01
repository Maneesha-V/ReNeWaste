import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPlantProfile, updateProfile } from "../../../services/wastePlant/profileService";
import { WastePlant, updateProfilePayload } from "../../../types/wasteplant/wastePlantTypes";

interface WasteplantState {
  wasteplant: WastePlant | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: WasteplantState = {
  wasteplant: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const fetchPlantProfile = createAsyncThunk(
  "wastePlantProfile/fetchPlantProfile",
  async (_, thunkAPI) => {
    try {
      const response = await getPlantProfile();
      return response;
    } catch (error: unknown) {
      let errorMessage = "Failed to fetch plant profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

  export const updatePlantProfile = createAsyncThunk(
    "wastePlantProfile/updatePlantProfile",
    async ( data : FormData, thunkAPI) => {
      console.log(data);

      try {
        const response = await updateProfile(data);
        return response;
      } catch (error: unknown) {
      let errorMessage = "Failed to update plant profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      return thunkAPI.rejectWithValue(errorMessage);
    }
    }
  );

  // export const fetchDrivers = createAsyncThunk(
  //   'driverProfile/fetchDrivers',
  //   async (wastePlantId: string, { rejectWithValue }) => {
  //     try {
  //       const response = await fetchDriversService(wastePlantId)
  //       return response.data;
  //     } catch(error: any){
  //       return rejectWithValue(
  //         error.response?.data?.message || "Failed to fetch drivers"
  //       );
  //     }
  //   }
  // );

const wastePlantProfileSlice = createSlice({
  name: "wastePlantProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlantProfile.fulfilled, (state, action) => {
        console.log("accc", action.payload);

        state.loading = false;
        state.wasteplant = action.payload.wasteplant;
      })
      .addCase(fetchPlantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    .addCase(updatePlantProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updatePlantProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.wasteplant = action.payload.wasteplant;
    })
    .addCase(updatePlantProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    // .addCase(fetchDrivers.pending, (state) => {
    //   state.loading = true;
    // })
    // .addCase(fetchDrivers.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.driver = action.payload;
    // })
    // .addCase(fetchDrivers.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export default wastePlantProfileSlice.reducer;
