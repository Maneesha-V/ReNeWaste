import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  assignTruckForDriver,
  createTruck,
  deleteTruckById,
  getAvailableTrucks,
  getTruckById,
  getTruckRequests,
  getTrucks,
  getTrucksForDriver,
  updateTruckById,
} from "../../../services/wastePlant/truckService";
import { MsgSuccessResp, PaginationPayload } from "../../../types/common/commonTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { AssignTruckToDriverResp, DeleteTruckResp, FetchAvailableTrucksResp, FetchTruckByIdResp, FetchTruckRequestsResp, FetchTrucksForDriverResp, FetchTrucksResp, TruckDTO, UpdateTruckResp } from "../../../types/truck/truckTypes";

interface TruckState {
  truckRequests: TruckDTO[] | [];
  availableTrucks: TruckDTO[] | [];
  trucks: TruckDTO[] | [];
  truck: TruckDTO | {};
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: TruckState = {
  truckRequests: [],
  availableTrucks: [],
  trucks: [],
  truck: {},
  loading: false,
  message: null,
  error: null,
  total: 0,
};

export const addTruck = createAsyncThunk<
  MsgSuccessResp,
  FormData,
  { rejectValue: { message: string } }
>("wastePlantTruck/addTruck", async (formData, { rejectWithValue }) => {
  try {
    const response = await createTruck(formData);
    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const fetchTrucks = createAsyncThunk<
  FetchTrucksResp,
  PaginationPayload,
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/fetchTrucks",
  async ({ page, limit, search }: PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getTrucks({ page, limit, search });
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchAvailableTrucks = createAsyncThunk<
  FetchAvailableTrucksResp,
  string,
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/fetchAvailableTrucks",
  async (driverId: string, { rejectWithValue }) => {
    try {
      const response = await getAvailableTrucks(driverId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchTruckById = createAsyncThunk<
  FetchTruckByIdResp,
  string,
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/fetchTruckById",
  async (truckId: string, { rejectWithValue }) => {
    try {
      const response = await getTruckById(truckId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const updateTruck = createAsyncThunk<
  UpdateTruckResp,
  { truckId: string; data: FormData },
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/updateTruck",
  async (
    { truckId, data }: { truckId: string; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      console.log("data", data);

      const response = await updateTruckById(truckId, data);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const deleteTruck = createAsyncThunk<
  DeleteTruckResp,
  string,
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/deleteTruck ",
  async (truckId: string, { rejectWithValue }) => {
    try {
      const response = await deleteTruckById(truckId);
      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchTruckRequests = createAsyncThunk<
  FetchTruckRequestsResp,
  void,
  { rejectValue: { message: string } }
>("wastePlantTruck/fetchTruckRequests ", async (_, { rejectWithValue }) => {
  try {
    const response = await getTruckRequests();
    console.log("res-serv", response);

    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});
export const fetchTrucksForDriver = createAsyncThunk<
  FetchTrucksForDriverResp,
  void,
  { rejectValue: { message: string } }
>("wastePlantTruck/fetchTrucksForDriver ", async (_, { rejectWithValue }) => {
  try {
    const response = await getTrucksForDriver();
    console.log("res-serv", response);

    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const assignTruckToDriver = createAsyncThunk<
  AssignTruckToDriverResp,
  { driverId: string; truckId: string; prevTruckId: string },
  { rejectValue: { message: string } }
>(
  "wastePlantTruck/assignTruckToDriver ",
  async (
    {
      driverId,
      truckId,
      prevTruckId,
    }: { driverId: string; truckId: string; prevTruckId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await assignTruckForDriver(
        driverId,
        truckId,
        prevTruckId
      );
      console.log("res-ass", response);

      return response;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
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
        state.trucks = action.payload.trucks;
        state.total = action.payload.total;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchAvailableTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload.trucks;
      })
      .addCase(fetchAvailableTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(addTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchTruckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckById.fulfilled, (state, action) => {
        state.loading = false;
        state.truck = action.payload.truck;
      })
      .addCase(fetchTruckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(updateTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTruck.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.trucks = state.trucks.filter((t: TruckDTO) => {
          return t._id !== action.payload.updatedTruck._id;
        });
      })
      .addCase(fetchTruckRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.truckRequests = action.payload.pendingTruckReqsts;
      })
      .addCase(fetchTruckRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(fetchTrucksForDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucksForDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.availableTrucks = action.payload.availableTrucks;
      })
      .addCase(fetchTrucksForDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(assignTruckToDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTruckToDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.truckRequests = action.payload.updatedRequests;
      })
      .addCase(assignTruckToDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default wastePlantTruckSlice.reducer;
