import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDriver,
  deleteDriverById,
  getCreateDriverService,
  getDriverById,
  getDrivers,
  updateDriverById,
} from "../../../services/wastePlant/driverService";
import { PaginationPayload } from "../../../types/commonTypes";
import { driverLogin } from "../driver/driverSlice";

interface DriverState {
  driver: any;
  taluk: string;
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: DriverState = {
  driver: [],
  taluk: "",
  loading: false,
  message: null,
  error: null,
  total: 0,
};

export const getCreateDriver = createAsyncThunk(
  "wastePlantDriver/getCreateDriver",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCreateDriverService();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch add driver"
      );
    }
  }
);

export const addDriver = createAsyncThunk(
  "wastePlantDriver/addDriver",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createDriver(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to add waste plant"
      );
    }
  }
);
export const fetchDrivers = createAsyncThunk(
  "wastePlantDriver/fetchDrivers",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getDrivers({ page, limit, search });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch waste plants"
      );
    }
  }
);
export const fetchDriverById = createAsyncThunk(
  "wastePlantDriver/fetchDriverById",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await getDriverById(driverId);
      console.log("response",response);
      
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);
export const updateDriver = createAsyncThunk(
  "wastePlantDriver/updateDriver",
  async (
    { driverId, data }: { driverId: string; data: FormData },
    thunkAPI
  ) => {
    try {
      console.log("data", data);

      const response = await updateDriverById(driverId, data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);
export const deleteDriver = createAsyncThunk(
  "wastePlantDriver/deleteDriver ",
  async (driverId: string, thunkAPI) => {
    try {
      const response = await deleteDriverById(driverId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);

const wastePlantDriverSlice = createSlice({
  name: "wastePlantDriver",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCreateDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.taluk = action.payload?.taluk;
      })
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload.drivers;
        state.total = action.payload.total;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload || [];
      })
      .addCase(addDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => { 
        state.loading = false;
        state.driver = action.payload.driver;
        state.taluk = action.payload.taluk;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.driver = action.payload;
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        console.log("accc",action.payload);

        state.message = action.payload.message;
        state.driver = state.driver.filter((d:any)=>{
          return d._id !== action.payload.updatedDriver._id
        })
      });
  },
});

export default wastePlantDriverSlice.reducer;
