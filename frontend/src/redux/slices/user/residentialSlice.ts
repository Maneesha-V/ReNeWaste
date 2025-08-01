import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getResidentialService, updateResidentialPickupService } from "../../../services/user/residentialService";
import { ResidPickupReqArgs } from "../../../types/pickupTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";

interface UserState {
    user: any;
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
  
  export const getResidential = createAsyncThunk(
    "userResidential/getResidential",
    async (_, { rejectWithValue }) => {
      try {
        const response = await getResidentialService();
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Loading failed. Please try again.");
      }
    }
  );

   export const updateResidentialPickup = createAsyncThunk<
   void,
   ResidPickupReqArgs,
   { rejectValue: {message : string}}
   >(
      "userResidential/updateResidentialPickup",
      async ({ data }: ResidPickupReqArgs, { rejectWithValue }) => {
        try {
          console.log("data",data);
          const response = await updateResidentialPickupService(data); 
          return response.data;
        } catch (err) {
          // return thunkAPI.rejectWithValue(
          //   error.response?.data?.message || "Failed to submit"
          // );
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
          state.error = action.payload as string;
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
          // state.error = action.payload as string;
          state.error = action.payload?.message || "Something went wrong";
        })
    },
  });
  
  export default userResidentialSlice.reducer;