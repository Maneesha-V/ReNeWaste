import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createWastePlant,
  deleteWastePlantById,
  getAddWastePlant,
  getPostOffices,
  getWastePlantById,
  getWastePlants,
  togglePlantBlockStatusService,
  updateWastePlantById,
} from "../../../services/superAdmin/wastePlantService";
import {
  PostOffice,
  TogglePlantBlockPayload,
  TogglePlantBlockResp,
} from "../../../types/wasteplant/wastePlantTypes";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import {
  MsgResp,
  MsgSuccessResp,
  PaginationPayload,
} from "../../../types/common/commonTypes";
import {
  DelPlantResp,
  FetchAddWPResp,
  FetchPlantByIdResp,
  PaginatedReturnAdminWastePlants,
  ReturnAdminWastePlant,
  WasteplantDTO,
} from "../../../types/superadmin/superAdminTypes";
import { SubsptnPlans } from "../../../types/subscription/subscriptionTypes";

interface WastePlantState {
  wastePlantWithSubPlan: ReturnAdminWastePlant[];
  wastePlant: WasteplantDTO;
  subscriptionPlans: SubsptnPlans[];
  loading: boolean;
  message: string | null;
  error: string | null;
  total: number;
}

const initialState: WastePlantState = {
  wastePlantWithSubPlan: [],
  wastePlant: {},
  subscriptionPlans: [],
  loading: false,
  message: null,
  error: null,
  total: 0,
};

export const fetchAddWastePlant =  createAsyncThunk<
  FetchAddWPResp,
  void,
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/fetchAddWastePlant",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAddWastePlant();
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const addWastePlant = createAsyncThunk<
  MsgSuccessResp,
  FormData,
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/addWastePlant",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createWastePlant(formData);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const fetchWastePlants = createAsyncThunk<
  PaginatedReturnAdminWastePlants,
  PaginationPayload,
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/fetchWastePlants",
  async ({ page, limit, search, capacityRange }, { rejectWithValue }) => {
    try {
      const response = await getWastePlants({
        page,
        limit,
        search,
        capacityRange,
      });
      console.log("res", response);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const fetchWastePlantById = createAsyncThunk<
  FetchPlantByIdResp,
  string,
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/fetchWastePlantById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getWastePlantById(id);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const updateWastePlant = createAsyncThunk<
  MsgResp,
  { id: string; data: FormData },
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/updateWastePlant",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateWastePlantById(id, data);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);
export const deleteWastePlant = createAsyncThunk<
  DelPlantResp,
  string,
  { rejectValue: { error: string } }
>(
  "superAdminWastePlant/deleteWastePlant",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteWastePlantById(id);
      return response;
    } catch (err) {
      const msg = getAxiosErrorMessage(err);
      return rejectWithValue({ error: msg });
    }
  }
);

// export const sendSubscribeNotification = createAsyncThunk(
//   "superAdminWastePlant/sendSubscribeNotification",
//   async (id: string, thunkAPI) => {
//     try {
//       const response = await sendSubscribeNotificationById(id);
//       return response;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response.data || "Failed to send subscribe reminder."
//       );
//     }
//   }
// );

// export const sendRenewNotification = createAsyncThunk(
//   "superAdminWastePlant/sendRenewNotification",
//   async ({ plantId, daysLeft }: RenewNotificationPayload, thunkAPI) => {
//     try {
//       const response = await sendRenewNotificationService({
//         plantId,
//         daysLeft,
//       });
//       return response;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response.data || "Failed to send renew reminder."
//       );
//     }
//   }
// );
// export const sendRechargeNotification = createAsyncThunk(
//   "superAdminWastePlant/sendRechargeNotification",
//   async (plantId: string, thunkAPI) => {
//     try {
//       const response = await sendRechargeNotificationService(plantId);
//       return response;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(
//         error.response.data || "Failed to send recharge reminder."
//       );
//     }
//   }
// );
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
export const togglePlantBlockStatus = createAsyncThunk<
  TogglePlantBlockResp,
  TogglePlantBlockPayload,
  { rejectValue: { message: string } }
>(
  "superAdminWastePlant/togglePlantBlockStatus",
  async ({ plantId, isBlocked }, { rejectWithValue }) => {
    try {
      const response = await togglePlantBlockStatusService(plantId, isBlocked);
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
  reducers: {
    updateBlockStatus: (state, action) => {
      const { plantId, isBlocked } = action.payload;
      state.wastePlantWithSubPlan = state.wastePlantWithSubPlan.map(
        (wp: ReturnAdminWastePlant) => {
          if (wp.plantData._id === plantId) {
            return {
              ...wp,
              plantData: { ...wp.plantData, isBlocked },
            };
          }
          return wp;
        }
      );
    },
    updateDeleteWastePlant: (state, action) => {
      const plantId = action.payload;
      state.wastePlantWithSubPlan = state.wastePlantWithSubPlan.filter(
        (wp: ReturnAdminWastePlant) => wp.plantData._id !== plantId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddWastePlant.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        state.message = action.payload.message;
        state.subscriptionPlans = action.payload.subscriptionPlans;
      })
      .addCase(fetchAddWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(addWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWastePlant.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(addWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(fetchWastePlants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlants.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlantWithSubPlan = action.payload.wasteplants;
        state.total = action.payload.total;
      })
      .addCase(fetchWastePlants.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { error: string })?.error;
      })
      .addCase(fetchWastePlantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWastePlantById.fulfilled, (state, action) => {
        state.loading = false;
        state.wastePlant = action.payload.wastePlant;
      })
      .addCase(fetchWastePlantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(updateWastePlant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWastePlant.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateWastePlant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })
      .addCase(deleteWastePlant.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.error = null;
        // state.wastePlantWithSubPlan = state.wastePlantWithSubPlan.filter((plant: any) => {
        //   return plant.plantData._id !== action.payload.updatedPlant.plantId;
        // });
      })
      // .addCase(sendSubscribeNotification.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(sendSubscribeNotification.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.message = action.payload;
      // })
      // .addCase(sendSubscribeNotification.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string;
      // })
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
      .addCase(togglePlantBlockStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePlantBlockStatus.fulfilled, (state, action) => {
        console.log("action", action.payload);
        state.loading = false;
        state.error = null;
        state.wastePlantWithSubPlan = state.wastePlantWithSubPlan.map(
          (w: ReturnAdminWastePlant) =>
            w.plantData._id === action.payload.wasteplant._id
              ? { ...w, plantData: action.payload.wasteplant }
              : w
        );
      })
      .addCase(togglePlantBlockStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { updateBlockStatus, updateDeleteWastePlant } =
  superAdminWastePlantSlice.actions;

export default superAdminWastePlantSlice.reducer;
