import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChatMessages, getConversationId } from "../../../services/wastePlant/chatService";
import { getAxiosErrorMessage } from "../../../utils/handleAxiosError";
import { ConversationIdPayload, fetchChatMessagesResp, fetchConversationIdResp, Message, MessagesPayload, MessagesResp } from "../../../types/chat/chatMessageType";

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
  export const fetchConversationId = createAsyncThunk<
  fetchConversationIdResp,
  ConversationIdPayload,
  { rejectValue: {message: string}}
  >(
    "wastePlantChats/fetchConversationId",
    async ( payload: ConversationIdPayload , { rejectWithValue }
    ) => {
      try {
        const response = await getConversationId(payload);
        console.log("resp",response);
        
        return response;
      } catch (error) {
        const msg = getAxiosErrorMessage(error);
        return rejectWithValue({ message: msg });
      }
    }
  );
  export const fetchChatMessages = createAsyncThunk<
  fetchChatMessagesResp,
  MessagesPayload,
  { rejectValue: {message: string}}
  >(
    "wastePlantChats/fetchMessages",
    async ( payload: MessagesPayload , { rejectWithValue }
    ) => {
      try {
        const response = await getChatMessages(payload);
        console.log("resp",response);
        
        return response;
      } catch (error) {
        const msg = getAxiosErrorMessage(error);
        return rejectWithValue({ message: msg });
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
        state.conversationId = action.payload.conversationId;
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
        state.messages = action.payload.messages.map((msg: MessagesResp): Message => ({
          ...msg,
          sender: msg.senderRole, 
        }));
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error";
      })
    },
});

export const { addMessage } = wasteplantConversationSlice.actions;
export default wasteplantConversationSlice.reducer;