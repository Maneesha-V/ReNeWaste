import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getChatMessages,
  getConversationId,
} from "../../../services/driver/chatService";
import {
  ConversationIdPayload,
  Message,
  MessagesPayload,
} from "../../../types/chatTypes";

interface ChatState {
  conversationId: string | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversationId: null,
  messages: [],
  loading: false,
  error: null,
};
export const fetchConversationId = createAsyncThunk(
  "driverChats/fetchConversationId",
  async (payload: ConversationIdPayload, { rejectWithValue }) => {
    try {
      const response = await getConversationId(payload);
      console.log("resp", response);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch conversation Id."
      );
    }
  }
);
export const fetchChatMessages = createAsyncThunk(
  "driverChats/fetchMessages",
  async (payload: MessagesPayload, { rejectWithValue }) => {
    try {
      const response = await getChatMessages(payload);
      console.log("resp", response);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch messages."
      );
    }
  }
);
const driverConversationSlice = createSlice({
  name: "driverChats",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
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
      })
      .addCase(fetchChatMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        // state.messages = action.payload;
        state.messages = action.payload.map((msg: Message)=>({
          ...msg,
          sender: msg.senderRole
        }))
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      });
  },
});

export const { addMessage } = driverConversationSlice.actions;
export default driverConversationSlice.reducer;
