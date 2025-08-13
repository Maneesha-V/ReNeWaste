import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAvailabilityService,
  getCommercialService,
  updateCommercialPickupService,
} from "../../../services/user/commercialService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { CommPickupReqArgs } from "../../../types/pickupReq/pickupTypes";
import { GetCommResp, UserResp } from "../../../types/user/userTypes";
import { MsgResponse } from "../../../types/common/commonTypes";

interface UserState {
  user: UserResp | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  message: null,
  token: null,
};

export const getCommercial = createAsyncThunk<
  GetCommResp,
  void,
  { rejectValue: { message: string } }
>("userCommercial/getCommercial", async (_, { rejectWithValue }) => {
  try {
    const response = await getCommercialService();
    return response.data;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});
export const checkServiceAvailability = createAsyncThunk<
  { available: boolean },
  { service: string; wasteplantId: string },
  { rejectValue: { message: string } }
>(
  "userCommercial/checkServiceAvailability",
  async ({ service, wasteplantId }, { rejectWithValue }) => {
    try {
      const response = await checkAvailabilityService(service, wasteplantId);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ message: msg });
    }
  }
);

export const updateCommercialPickup = createAsyncThunk<
  MsgResponse,
  CommPickupReqArgs,
  { rejectValue: { message: string } }
>(
  "userCommercial/updateCommercialPickup",
  async ({ data }: CommPickupReqArgs, { rejectWithValue }) => {
    try {
      const response = await updateCommercialPickupService(data);
      return response.data;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ message: msg });
    }
  }
);

const userCommercialSlice = createSlice({
  name: "userCommercial",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCommercial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommercial.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getCommercial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(updateCommercialPickup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCommercialPickup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateCommercialPickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default userCommercialSlice.reducer;
