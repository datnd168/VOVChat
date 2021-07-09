import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import ChatUtil from '../../utils/ChatUtil';

const OBJECT_TYPE = {
  Conversation: 0,
  Message: 1,
};
const CHANGE_TYPE = {
  Insert: 0,
  Update: 1,
  Delete: 2,
};
export const MESSAGES_STATUS = {
  INITIALIZE: 0,
  SENDING: 1,
  SENT: 2,
  DELIVERED: 3,
  READ: 4,
};

const initialState = {
  isMesLoading: true,
  isMesError: null,
  messages: [],
  isConvsLoading: true,
  isConvsError: null,
  convs: [],
  currentConversationId: -1,
  userInfo: '',
  stringeeUser: null,
  isFocused: false,
  focusId: null,
};

export const updateUserStringee = createAsyncThunk(
  'chat/user',
  async (payload, thunkApi) => {
    return payload;
  },
);

export const onObjectChange = createAsyncThunk(
  'chat/change',
  async (payload, thunkApi) => {
    return payload;
  },
);

export const getListMessages = createAsyncThunk(
  'chat/messages',
  async (conversationsId, thunkApi) => {
    if (conversationsId === -1) return [];
    var count = 100;
    var isAscending = false;
    var message = [];
    try {
      message = await new Promise((resolve, reject) => {
        ChatUtil.getStringeeClient().getLastMessages(
          conversationsId,
          count,
          isAscending,
          true,
          true,
          function (status, code, message, messages) {
            resolve(messages);
          },
        );
      });
    } catch (error) {
      console.log({error});
    }
    return message;
  },
);

const updateMes = (state, data) => {
  data.objectChanges.forEach(message => {
    if (message.conversationId === state.currentConversationId) {
      switch (data.changeType) {
        case CHANGE_TYPE.Insert:
          const tmpMessage = {...message};
          state.messages.unshift(tmpMessage);
          const convIndex = state.convs.findIndex(
            x => x.id === message.conversationId,
          );
          if (convIndex !== -1) {
            markConversationAsRead(state.convs[convIndex].id, state.isFocused);
          }
          state.convs.sort((a, b) =>
            a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0,
          );
          break;
        case CHANGE_TYPE.Update:
          console.log('Update');
          let foundMessage = state.messages.find(
            x => x.localId === message.localId,
          );
          if (foundMessage) {
            foundMessage.state = message.state;
          }
          break;
        case CHANGE_TYPE.Delete:
          foundMessage = state.messages.findIndex(
            x => x.localId === message.localId,
          );
          if (foundMessage !== -1) {
            state.messages.slice(foundMessage, 1);
          }
          break;
        default:
          break;
      }
    }
  });
  return state;
};

export const countSlice = createSlice({
  name: 'count',
  reducers: {
    reset: state => initialState,
  },
  initialState,
  extraReducers: {
    [updateUserStringee.fulfilled]: (state, action) => {
      state.stringeeUser = action.payload;
      return state;
    },

    [getListMessages.pending]: (state, action) => {
      state.currentConversationId = action.meta.arg;
      state.isMesLoading = true;
      return state;
    },

    [getListMessages.rejected]: (state, action) => {
      state.isMesLoading = false;
      state.isMesError = true;
      return state;
    },

    [getListMessages.fulfilled]: (state, action) => {
      state.isMesLoading = false;
      state.messages = action.payload;
      return state;
    },

    [onObjectChange.fulfilled]: (state, action) => {
      updateMes(state, action.payload);
    },
  },
});

export const {actions, reducer} = countSlice;
export const {reset} = actions;
export default reducer;
