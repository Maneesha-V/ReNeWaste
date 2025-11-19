import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { AddRatingReq } from "../../../types/rating/ratingTypes";
import { addRatingService } from "../../../services/user/ratingService";

interface RatingState {
  loading: boolean;
  message: string | null;
  error: string | null;
}
const initialState: RatingState = {
  loading: false,
  message: null,
  error: null,
};

export const addRating = createAsyncThunk<
  any,
  AddRatingReq,
  { rejectValue: { error: string } }
>("userRating/addRating", async (data, { rejectWithValue }) => {
  try {
    const response = await addRatingService(data);
    console.log("response", response);

    return response;
  } catch (err) {
    console.error("err", err);
    const msg = getAxiosErrorMessage(err);
    return rejectWithValue({ error: msg });
  }
});

const userRatingSlice = createSlice({
  name: "userRating",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRating.fulfilled, (state, action) => {
        console.log("acc", action.payload);
        state.loading = false;
      })
      .addCase(addRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })

    },
});

export default userRatingSlice.reducer;
