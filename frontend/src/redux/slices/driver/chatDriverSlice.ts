import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversationId } from "../../../services/driver/chatService";
import { ConversationIdPayload } from "../../../types/chatTypes";

interface ChatState {
    conversationId: string | null,
    loading: boolean,
    error: string | null,
  }
  
  const initialState: ChatState = {
    conversationId: null,
    loading: false,
    error: null,
  };
  export const fetchConversationId = createAsyncThunk(
    "driverChats/fetchConversationId",
    async ( payload: ConversationIdPayload , { rejectWithValue }
    ) => {
      try {
        const response = await getConversationId(payload);
        console.log("resp",response);
        
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch conversation Id.");
      }
    }
  );
  const driverConversationSlice  = createSlice({
    name: "driverChats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
      .addCase(fetchConversationId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversationId.fulfilled, (state, action) => {
        state.loading = false;
        state.conversationId = action.payload;
      })
      .addCase(fetchConversationId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
    },
});

export default driverConversationSlice.reducer;