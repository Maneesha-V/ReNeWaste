import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getPlantProfile,
  updateProfile,
} from "../../../services/wastePlant/profileService";
import {
  FetchPlantProfileResp,
  UpdatePlantProfileResp,
  WastePlant,
} from "../../../types/wasteplant/wastePlantTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";

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

export const fetchPlantProfile = createAsyncThunk<
  FetchPlantProfileResp,
  void,
  { rejectValue: { message: string } }
>("wastePlantProfile/fetchPlantProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await getPlantProfile();
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const updatePlantProfile = createAsyncThunk<
  UpdatePlantProfileResp,
  FormData,
  { rejectValue: { message: string } }
>(
  "wastePlantProfile/updatePlantProfile",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await updateProfile(data);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

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
        state.error = action.payload?.message as string;
      })
      .addCase(updatePlantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.wasteplant = action.payload.updatedPlant;
      })
      .addCase(updatePlantProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default wastePlantProfileSlice.reducer;
