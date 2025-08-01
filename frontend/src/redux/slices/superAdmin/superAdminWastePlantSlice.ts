import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createWastePlant,
  deleteWastePlantById,
  getPostOffices,
  getWastePlantById,
  getWastePlants,
  sendRechargeNotificationService,
  sendRenewNotificationService,
  sendSubscribeNotificationById,
  updateWastePlantById,
} from "../../../services/superAdmin/wastePlantService";
import { RenewNotificationPayload } from "../../../types/wastePlantTypes";
import { PostOffice } from "../../../types/wasteplant/wastePlantTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { PaginationPayload } from "../../../types/common/commonTypes";

interface WastePlantState {
  wastePlant: any;
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: WastePlantState = {
  wastePlant: [],
  loading: false,
  message: null,
  error: null,
  total: 0,
};

export const addWastePlant = createAsyncThunk(
  "superAdminWastePlant/addWastePlant",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createWastePlant(formData);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err); 
      return rejectWithValue({ message: msg });
    }
  }
);
export const fetchWastePlants = createAsyncThunk(
  "superAdminWastePlant/fetchWastePlants",
  async ({page, limit, search} : PaginationPayload, { rejectWithValue }) => {
    try {
      const response = await getWastePlants({page, limit, search});
      console.log("res", response);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch waste plants"
      );
    }
  }
);
export const fetchWastePlantById = createAsyncThunk(
  "superAdminWastePlant/fetchWastePlantById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getWastePlantById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch data");
    }
  }
);
export const updateWastePlant = createAsyncThunk(
  "superAdminWastePlant/updateWastePlant",
  async ({ id, data }: { id: string; data: FormData }, thunkAPI) => {
    try {
      const response = await updateWastePlantById(id, data);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);
export const deleteWastePlant = createAsyncThunk(
  "superAdminWastePlant/deleteWastePlant",
  async (id: string, thunkAPI) => {
    try {
      const response = await deleteWastePlantById(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to update data."
      );
    }
  }
);
export const sendSubscribeNotification = createAsyncThunk(
  "superAdminWastePlant/sendSubscribeNotification",
  async (id: string, thunkAPI) => {
    try {
      const response = await sendSubscribeNotificationById(id);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to send subscribe reminder."
      );
    }
  }
);
export const sendRenewNotification = createAsyncThunk(
  "superAdminWastePlant/sendRenewNotification",
  async ({plantId,daysLeft}: RenewNotificationPayload, thunkAPI) => {
    try {
      const response = await sendRenewNotificationService({plantId,daysLeft});
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to send renew reminder."
      );
    }
  }
);
export const sendRechargeNotification = createAsyncThunk(
  "superAdminWastePlant/sendRechargeNotification",
  async (plantId: string, thunkAPI) => {
    try {
      const response = await sendRechargeNotificationService(plantId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response.data || "Failed to send recharge reminder."
      );
    }
  }
);
export const fetchPostOffices = createAsyncThunk<
  PostOffice[],               
  string,     
  { rejectValue: { message: string } } 
>(
  "superAdminWastePlant/fetchPostOffices",
  async (pincode, { rejectWithValue }) => {
    try {
      const response = await getPostOffices(pincode);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err); 
      return rejectWithValue({ message: msg });
    }
  }
);
const superAdminWastePlantSlice = createSlice({
  name: "superAdminWastePlant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWastePlant.fulfilled, (state, action) => {
        console.log("action",action);
        
        state.loading = false;
        // state.wastePlant = action.payload || [];
      })
      .addCase(addWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWastePlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlants.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload.wasteplants;
        state.total = action.payload.total;
      })
      .addCase(fetchWastePlants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchWastePlantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlantById.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload;
      })
      .addCase(fetchWastePlantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWastePlant.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload;
      })
      .addCase(updateWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWastePlant.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.wastePlant = state.wastePlant.filter((plant: any) => {      
          return plant.plantData._id !== action.payload.updatedPlant.plantId;
        });
      })
      .addCase(sendSubscribeNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendSubscribeNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(sendSubscribeNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPostOffices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostOffices.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchPostOffices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
  },
});

export default superAdminWastePlantSlice.reducer;
