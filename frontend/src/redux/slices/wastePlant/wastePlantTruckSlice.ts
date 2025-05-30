import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { assignTruckForDriver, createTruck, deleteTruckById, getAvailableTrucks, getTruckById, getTruckRequests, getTrucks, getTrucksForDriver, updateTruckById } from "../../../services/wastePlant/truckService";
import { PaginationPayload } from "../../../types/commonTypes";


interface TruckState {
  truckRequests: any;
  availableTrucks :any;
  truck: any;
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: TruckState = {
  truckRequests: [],
  availableTrucks : [],
  truck: [],
  loading: false,
  message: null,
  error: null,
  total: 0,
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
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getTrucks({ page, limit, search });
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
export const fetchTrucksForDriver = createAsyncThunk(
  "wastePlantTruck/fetchTrucksForDriver ",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTrucksForDriver();
      console.log("res-serv",response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch trucks for driver."
      );
    }
  }
);

export const assignTruckToDriver = createAsyncThunk(
  "wastePlantTruck/assignTruckToDriver ",
  async ({ driverId, truckId, prevTruckId }: { driverId: string; truckId: string,prevTruckId: string }, { rejectWithValue }) => {
    try {
      const response = await assignTruckForDriver( driverId, truckId,prevTruckId);
      console.log("res-ass",response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to assign truck to driver."
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
        state.truck = action.payload.trucks;
        state.total = action.payload.total;
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
       .addCase(fetchTrucksForDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucksForDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.availableTrucks  = action.payload;
      })
      .addCase(fetchTrucksForDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
       .addCase(assignTruckToDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTruckToDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.truckRequests = action.payload.truckRequests;
      })
      .addCase(assignTruckToDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export default wastePlantTruckSlice.reducer;
