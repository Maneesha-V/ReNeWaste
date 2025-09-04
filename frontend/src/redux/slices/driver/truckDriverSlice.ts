import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAvaialbleTrucks,
  markTruckReturnService,
  reqTruck,
} from "../../../services/driver/truckService";
import { markReturnedProps } from "../../../types/driver/driverTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  fetchDriverTrucksResp,
  reqTruckByDriverResp,
} from "../../../types/truck/truckTypes";

interface TruckState {
  trucks: any;
  hasRequestedTruck: boolean;
  loading: boolean;
  message: string | null;
  error: string | null;
}

const initialState: TruckState = {
  trucks: [],
  hasRequestedTruck: false,
  loading: false,
  message: null,
  error: null,
};
export const fetchDriverTrucks = createAsyncThunk<
  fetchDriverTrucksResp,
  string,
  { rejectValue: { message: string } }
>(
  "driverTrucks/fetchDriverTrucks",
  async (wasteplantId: string, { rejectWithValue }) => {
    try {
      const response = await getAvaialbleTrucks(wasteplantId);
      console.log("resp", response);

      return response;
    } catch (error) {
      console.error("err", error);
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);
export const reqTruckByDriver = createAsyncThunk<
  reqTruckByDriverResp,
  void,
  { rejectValue: { message: string } }
>("driverTrucks/reqTruckByDriver", async (_, { rejectWithValue }) => {
  try {
    const response = await reqTruck();
    console.log("resp", response);

    return response;
  } catch (error) {
    const msg = getAxiosErrorMessage(error);
    return rejectWithValue({ message: msg });
  }
});

export const markTruckReturned = createAsyncThunk<
  any,
  markReturnedProps,
  { rejectValue: { message: string } }
>(
  "driverTrucks/markTruckReturned",
  async ({ truckId, plantId }: markReturnedProps, { rejectWithValue }) => {
    try {
      await markTruckReturnService({ truckId, plantId });
      return;
    } catch (error) {
      const msg = getAxiosErrorMessage(error);
      return rejectWithValue({ message: msg });
    }
  }
);

const driverTruckSlice = createSlice({
  name: "driverTrucks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks = action.payload;
      })
      .addCase(fetchDriverTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })
      .addCase(reqTruckByDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reqTruckByDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.hasRequestedTruck = true;
      })
      .addCase(reqTruckByDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      })

      .addCase(markTruckReturned.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markTruckReturned.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(markTruckReturned.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message as string;
      });
  },
});

export default driverTruckSlice.reducer;
