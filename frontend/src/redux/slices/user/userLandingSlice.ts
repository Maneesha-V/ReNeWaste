import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { checkCurrentLocationService, checkServiceAvailbleService, searchLocationService } from "../../../services/user/landingService";
import { CurrentLocationResp, LocationSuggestion, WPServiceResp } from "../../../types/common/commonTypes";

interface UserLandingState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  location: string | null;
  suggestions: LocationSuggestion[];
  plantName: string;
  hasCheckedService: boolean;
}

const initialState: UserLandingState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  location: null,
  suggestions: [],
  plantName: "",
  hasCheckedService: false,
};

export const searchLocation = createAsyncThunk<
  LocationSuggestion[],
  string,
  { rejectValue: { message: string } }
>("userLanding/searchLocation", async ( location, { rejectWithValue }) => {
  try {
    const response = await searchLocationService(location);
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const checkServiceAvailability = createAsyncThunk<
  WPServiceResp,
  string,
  { rejectValue: { message: string} }
>("userLanding/checkServiceAvailability", async (description, { rejectWithValue }) => {
  try {
    const response = await checkServiceAvailbleService(description);
    console.log({response});
    
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
})

export const checkCurrentLocation = createAsyncThunk<
  CurrentLocationResp,
  { latitude: number; longitude: number },
  { rejectValue: { message: string} }
>("userLanding/checkCurrentLocation", async ({ latitude, longitude }, { rejectWithValue }) => {
  try {
    const response = await checkCurrentLocationService(latitude, longitude);
     console.log({response});
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
})

const userLandingSlice = createSlice({
  name: "userLanding",
  initialState,
  reducers: {
    clearSuggestions(state) {
        state.suggestions = [];
    } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchLocation.fulfilled, (state, action) => {
        console.log(action.payload);    
        state.loading = false;
        state.suggestions = action.payload;
        state.hasCheckedService = false;
        state.success = false;
        state.plantName = "";
      })
      .addCase(searchLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(checkServiceAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkServiceAvailability.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.hasCheckedService = true;
        state.success = action.payload.serviceAvailable;
        state.plantName = action.payload.plantName ?? "";
      })
      .addCase(checkServiceAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.success = false;
        state.hasCheckedService = true;
      })
      .addCase(checkCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkCurrentLocation.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.hasCheckedService = true;
        state.success = action.payload.serviceAvailable;
        state.plantName = action.payload.plantName ?? "";
      })
  },
});

export const { clearSuggestions } = userLandingSlice.actions;

export default userLandingSlice.reducer;
