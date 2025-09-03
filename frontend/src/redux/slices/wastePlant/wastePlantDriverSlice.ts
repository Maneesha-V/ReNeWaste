import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createDriver,
  deleteDriverById,
  getCreateDriverService,
  getDriverById,
  getDrivers,
  updateDriverById,
} from "../../../services/wastePlant/driverService";
import {
  MsgSuccessResp,
  PaginationPayload,
} from "../../../types/common/commonTypes";
import { driverLogin } from "../driver/driverSlice";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  DeleteDriverResp,
  DriverDTO,
  FetchDriverByIdResp,
  FetchDriversResp,
  GetCreateDriverResp,
  UpdateDriverResp,
} from "../../../types/driver/driverTypes";

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

export const getCreateDriver = createAsyncThunk<
  GetCreateDriverResp,
  void,
  { rejectValue: { message: string } }
>("wastePlantDriver/getCreateDriver", async (_, { rejectWithValue }) => {
  try {
    const response = await getCreateDriverService();
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const addDriver = createAsyncThunk<
  MsgSuccessResp,
  FormData,
  { rejectValue: { message: string } }
>(
  "wastePlantDriver/addDriver",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createDriver(formData);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchDrivers = createAsyncThunk<
  FetchDriversResp,
  PaginationPayload,
  { rejectValue: { message: string } }
>(
  "wastePlantDriver/fetchDrivers",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getDrivers({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchDriverById = createAsyncThunk<
  FetchDriverByIdResp,
  string,
  { rejectValue: { message: string } }
>(
  "wastePlantDriver/fetchDriverById",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await getDriverById(driverId);
      console.log("response", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const updateDriver = createAsyncThunk<
  UpdateDriverResp,
  { driverId: string; data: FormData },
  { rejectValue: { message: string } }
>(
  "wastePlantDriver/updateDriver",
  async (
    { driverId, data }: { driverId: string; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      console.log("data", data);

      const response = await updateDriverById(driverId, data);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const deleteDriver = createAsyncThunk<
  DeleteDriverResp,
  string,
  { rejectValue: { message: string } }
>(
  "wastePlantDriver/deleteDriver ",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await deleteDriverById(driverId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
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
        state.taluk = action.payload?.data.taluk;
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
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      })
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        console.log("acc",action.payload);
        
        state.loading = false;
        state.driver = action.payload.data.driver;
        state.taluk = action.payload.data.taluk;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
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
        state.error = action.payload?.message as string;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.driver = state.driver.filter((d: DriverDTO) => {
          return d._id !== action.payload.updatedDriver._id;
        });
      });
  },
});

export default wastePlantDriverSlice.reducer;
