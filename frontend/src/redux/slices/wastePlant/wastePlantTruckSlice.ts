import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTruck, deleteTruckById, getAvailableTrucks, getTruckById, getTruckRequests, getTrucks, updateTruckById } from "../../../services/wastePlant/truckService";


interface TruckState {
  truckRequests: any;
  truck: any;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: TruckState = {
  truckRequests: [],
  truck: [],
  loading: false,
  message: null,
  error: null,
};

export const addTruck = createAsyncThunk(
  "wastePlantTruck/addTruck",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createTruck(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add truck"
      );
    }
  }
);
export const fetchTrucks = createAsyncThunk(
  "wastePlantTruck/fetchTrucks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTrucks();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch trucks"
      );
    }
  }
);
export const fetchAvailableTrucks = createAsyncThunk(
  "wastePlantTruck/fetchAvailableTrucks",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await getAvailableTrucks(driverId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch trucks"
      );
    }
  }
);
export const fetchTruckById = createAsyncThunk(
  "wastePlantTruck/fetchTruckById",
  async (truckId: string, { rejectWithValue }) => {
    try {
      const response = await getTruckById(truckId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);
export const updateTruck = createAsyncThunk(
  "wastePlantTruck/updateTruck",
  async (
    { truckId, data }: { truckId: string; data: FormData },
    thunkAPI
  ) => {
    try {
      console.log("data", data);

      const response = await updateTruckById(truckId, data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);
export const deleteTruck = createAsyncThunk(
  "wastePlantTruck/deleteTruck ",
  async (truckId: string, thunkAPI) => {
    try {
      const response = await deleteTruckById(truckId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);
export const fetchTruckRequests = createAsyncThunk(
  "wastePlantTruck/fetchTruckRequests ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTruckRequests();
      console.log("res-serv",response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch truck requests."
      );
    }
  }
);
const wastePlantTruckSlice = createSlice({
  name: "wastePlantTruck",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAvailableTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload;
      })
      .addCase(fetchAvailableTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload || [];
      })
      .addCase(addTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTruckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckById.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload;
      })
      .addCase(fetchTruckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload;
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.truck = state.truck.filter(
          (truck: any) => truck._id !== action.payload
        );
      })
      .addCase(fetchTruckRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.truckRequests = action.payload;
      })
      .addCase(fetchTruckRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default wastePlantTruckSlice.reducer;
