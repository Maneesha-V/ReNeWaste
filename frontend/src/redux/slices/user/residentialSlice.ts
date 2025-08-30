import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getResidentialService,
  updateResidentialPickupService,
} from "../../../services/user/residentialService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { GetResidResp, UserResp } from "../../../types/user/userTypes";
import { MsgResponse } from "../../../types/common/commonTypes";
import { ResidPickupReqArgs } from "../../../types/pickupReq/pickupTypes";

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

export const getResidential = createAsyncThunk<
  GetResidResp,
  void,
  { rejectValue: { message: string } }
>("userResidential/getResidential", async (_, { rejectWithValue }) => {
  try {
    const response = await getResidentialService();
    return response;
  } catch (err) {
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ message: msg });
  }
});

export const updateResidentialPickup = createAsyncThunk<
  MsgResponse,
  ResidPickupReqArgs,
  { rejectValue: { message: string } }
>(
  "userResidential/updateResidentialPickup",
  async ({ data }: ResidPickupReqArgs, { rejectWithValue }) => {
    try {
      console.log("data", data);
      const response = await updateResidentialPickupService(data);
      return response.data;
    } catch (err) {
      console.log("err",err)
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ message: msg });
    }
  }
);
const userResidentialSlice = createSlice({
  name: "userResidential",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getResidential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResidential.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getResidential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(updateResidentialPickup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResidentialPickup.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateResidentialPickup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export default userResidentialSlice.reducer;
