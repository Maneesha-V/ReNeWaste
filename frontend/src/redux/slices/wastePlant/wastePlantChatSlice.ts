import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationIdPayload, Message, MessagesPayload } from "../../../types/chatTypes";
import { getChatMessages, getConversationId } from "../../../services/wastePlant/chatService";

interface ChatState {
    conversationId: string | null,
    messages: Message[],
    loading: boolean,
    error: string | null,
  }
  
  const initialState: ChatState = {
    conversationId: null,
    messages: [],
    loading: false,
    error: null,
  };
  export const fetchConversationId = createAsyncThunk(
    "wastePlantChats/fetchConversationId",
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
  export const fetchChatMessages = createAsyncThunk(
    "wastePlantChats/fetchMessages",
    async ( payload: MessagesPayload , { rejectWithValue }
    ) => {
      try {
        const response = await getChatMessages(payload);
        console.log("resp",response);
        
        return response;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch messages.");
      }
    }
  );
 
  const wasteplantConversationSlice  = createSlice({
    name: "wastePlantChats",
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
        state.messages = action.payload.map((msg: Message) => ({
          ...msg,
          sender: msg.senderRole, 
        }));
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      })
      // .addCase(addMessage.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(addMessage.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.messages = action.payload;
      // })
      // .addCase(addMessage.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message || "Error";
      // })
    },
});

export const { addMessage } = wasteplantConversationSlice.actions;
export default wasteplantConversationSlice.reducer;