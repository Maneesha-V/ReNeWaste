import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createWastePlant, getWastePlantById, getWastePlants, updateWastePlantById } from "../../../services/superAdmin/wastePlantService" 

interface WastePlantState {
  wastePlant: any; 
  loading: boolean;
  message: string | null
  error: string | null;
}

const initialState: WastePlantState = {
  wastePlant: [],
  loading: false,
  message: null,
  error: null,
};

export const addWastePlant = createAsyncThunk(
  "superAdminWastePlant/addWastePlant",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createWastePlant(formData);
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add waste plant");
    }
  }
);
export const fetchWastePlants = createAsyncThunk(
  "superAdminWastePlant/fetchWastePlants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWastePlants();
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch waste plants");
    }
  }
);
export const fetchWastePlantById = createAsyncThunk(
  "superAdminWastePlant/fetchWastePlantById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getWastePlantById(id)
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);
export const updateWastePlant = createAsyncThunk(
  "superAdminWastePlant/updateWastePlant",
  async ({ id, data }: { id: string; data: FormData }, thunkAPI) => {
    try {
      const response = await updateWastePlantById(id, data)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data || "Failed to update data.");
    }
  }
)
const superAdminWastePlantSlice = createSlice({
  name: "superAdminWastePlant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWastePlant.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload || []; 
      })
      .addCase(addWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWastePlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlants.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload; 
      })
      .addCase(fetchWastePlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWastePlantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlantById.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload;
      })
      .addCase(fetchWastePlantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWastePlant.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload;
      })
      .addCase(updateWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default superAdminWastePlantSlice.reducer;
