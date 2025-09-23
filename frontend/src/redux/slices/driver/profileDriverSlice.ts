import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchDriversService,
  getDriverProfile,
  updateProfile,
} from "../../../services/driver/profileService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  DriverDTO,
  FetchDriverProfileResp,
  FetchDriversRespns,
  UpdateDriverArgs,
  UpdateDriverProfileResp,
} from "../../../types/driver/driverTypes";

interface DriverState {
  drivers: DriverDTO[];
  driver: DriverDTO | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: DriverState = {
  drivers: [],
  driver: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const fetchDriverProfile = createAsyncThunk<
  FetchDriverProfileResp,
  void,
  { rejectValue: { message: string } }
>("driverProfile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await getDriverProfile();
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const updateDriverProfile = createAsyncThunk<
  UpdateDriverProfileResp,
  UpdateDriverArgs,
  { rejectValue: { message: string } }
>(
  "driverProfile/updateProfile",
  async ({ data }: UpdateDriverArgs, { rejectWithValue }) => {
    try {
      const response = await updateProfile(data);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchDrivers = createAsyncThunk<
  FetchDriversRespns,
  string,
  { rejectValue: { message: string } }
>(
  "driverProfile/fetchDrivers",
  async (wastePlantId: string, { rejectWithValue }) => {
    try {
      const response = await fetchDriversService(wastePlantId);
      return response.data;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
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
        state.error = action.payload?.message as string;
      })
      .addCase(updateDriverProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriverProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload.updatedDriver;
      })
      .addCase(updateDriverProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.drivers;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default driverProfileSlice.reducer;
