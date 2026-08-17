import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { AddRatingReq, AddRatingResponse } from "../../../types/rating/ratingTypes";
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
  AddRatingResponse,
  AddRatingReq,
  { rejectValue: { error: string } }
>("userRating/addRating", async (data, { rejectWithValue }) => {
  try {
    const response = await addRatingService(data);
    return response;
  } catch (err) {
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
      .addCase(addRating.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error as string;
      })

    },
});

export default userRatingSlice.reducer;
