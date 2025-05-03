import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getResidentialService, updateResidentialPickupService } from "../../../services/user/residentialService";
import { ResidPickupReqArgs } from "../../../types/pickupTypes";

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

   export const updateResidentialPickup = createAsyncThunk(
      "userResidential/updateResidentialPickup",
      async ({ data }: ResidPickupReqArgs, thunkAPI) => {
        try {
          console.log("data",data);
          const response = await updateResidentialPickupService(data); 
          return response.data;
        } catch (error: any) {
          return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Failed to submit"
          );
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
          state.user = action.payload.user;
        })
        .addCase(updateResidentialPickup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
    },
  });
  
  export default userResidentialSlice.reducer;