import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getResidentialService, updateResidentialPickupService } from "../../../services/user/residentialService";
import { CommPickupReqArgs, ResidPickupReqArgs } from "../../../types/pickupTypes";
import { checkAvailabilityService, getCommercialService, updateCommercialPickupService } from "../../../services/user/commercialService";

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
  
  export const getCommercial = createAsyncThunk(
    "userCommercial/getCommercial",
    async (token: string, { rejectWithValue }) => {
      try {
        const response = await getCommercialService(token);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.error || "Loading failed, Please try again.");
      }
    }
  );
  export const checkServiceAvailability = createAsyncThunk(
    'userCommercial/checkServiceAvailability',
    async ({ service, wasteplantId }: { service: string; wasteplantId: string }, thunkAPI) => {
      try {
        const response = await checkAvailabilityService(service, wasteplantId)
        
        return response.data;
      
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || "Unexpected error");
      }
    }
  );
  
   export const updateCommercialPickup = createAsyncThunk(
      "userCommercial/updateCommercialPickup",
      async ({ data, token }: CommPickupReqArgs, thunkAPI) => {
        try {
          console.log("data",data);
          console.log("token",token);
          const response = await updateCommercialPickupService(data, token); 
          return response.data;
        } catch (error: any) {
          return thunkAPI.rejectWithValue(
            error.response?.data?.message || "Failed to submit"
          );
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
          state.error = action.payload as string;
        })
        .addCase(updateCommercialPickup.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateCommercialPickup.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
        })
        .addCase(updateCommercialPickup.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
    },
  });
  
  export default userCommercialSlice.reducer;