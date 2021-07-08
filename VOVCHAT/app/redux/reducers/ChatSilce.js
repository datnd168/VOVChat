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
  READ:4,
}


const initialState = {
  isMesLoading: true,
  isMesError: null,
  messages: [],
  isConvsLoading: true,
  isConvsError: null,
  convs: [],
  currentConversationId: -1,
  userInfo:'',
  stringeeUser: null,
  isFocused: false,
  focusId: null,
};


export const updateUserStringee = createAsyncThunk('chat/user', async (payload, thunkApi) => {
    return payload;
  });
  export const updateUserInfo = createAsyncThunk('chat/userInfo', async (payload, thunkApi) => {
    return payload;
  });

export const onObjectChange = createAsyncThunk('chat/change', async (payload, thunkApi) => {
  return payload;
});

export const markConversation = createAsyncThunk('chat/markConversation', async (payload, thunkApi) => {
  return payload;
});

export const focusId = createAsyncThunk('chat/focusId', async (payload, thunkApi) => {
  return payload;
});

export const getListConvs = createAsyncThunk('chat/convs', async (payload, thunkApi) => {
  var count = 50;
  var isAscending = false;
  const res = await new Promise((resolve, reject) => {
    ChatUtil.getStringeeClient().getLastConversations(count, isAscending, function(status, code, message, convs) {
      // console.log({ status, code, message, convs });
      resolve(convs);
    });
  });
  return {
    data: res,
    payload,
  };
});

export const getListMessages=createAsyncThunk('chat/messages',async (conversationsId,thunkApi)=>{
  if (conversationsId === -1) return [];
  var count= 100;
  var isAscending=false;
  var message=[];
  try {
    message = await new Promise((resolve,reject)=>{
      ChatUtil.getStringeeClient().getLastMessages(conversationsId,count,isAscending,true,true,function(status,code,message,messages){
        resolve(messages)
      })
    })
  } catch (error) {
    console.log({ error });
  }
  await markConversationAsRead(conversationsId);
  return message;
})

const markConversationAsRead = async (conversationsId, isFocused = true) => {
  if (isFocused)
    return new Promise((resolve, reject) => {
      ChatUtil.getStringeeClient().markConversationAsRead(conversationsId, function(status, code, message) {
        console.log({ status, code, message });
        resolve(message);
      });
    });
};

const updateConvs = (state, data) => {
  console.log('Update Conv', { data });
  let foundIndex;
  data.objectChanges.forEach(conv => {
    switch (data.changeType) {
      case CHANGE_TYPE.Insert:
        console.log('Update Conv CHANGE_TYPE.Insert');
        foundIndex = state.convs.findIndex(x => x.id === conv.id);
        if (foundIndex !== -1) {
          const clone = JSON.parse(JSON.stringify(conv));
          state.convs[foundIndex] = clone;
          state.convs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0));
          reactotron.log('clone', 'conv', Platform.OS, clone, conv);
          if (conv.id == state.focusId) {
            state.convs[foundIndex].unreadCount = 0;
          }
        } else {
          state.convs.unshift({ ...conv });
        }

        break;
      case CHANGE_TYPE.Update:
        console.log('Update Conv CHANGE_TYPE.Update');
        foundIndex = state.convs.findIndex(x => x.id === conv.id);
        if (foundIndex !== -1) {
          const clone = JSON.parse(JSON.stringify(conv));
          state.convs[foundIndex] = clone;
          if (clone.id == state.focusId) {
            state.convs[foundIndex].unreadCount = 0;
          }
        }
        state.convs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0));
        break;
      case CHANGE_TYPE.Delete:
        console.log('Update Conv');
        state.convs = [...state.convs.filter(x => x.id !== conv.id)];
        break;

      default:
        break;
    }
  });
};

const updateMes = (state, data) => {
  // console.log('updateMes',data);
  data.objectChanges.forEach(message => {
    if (message.conversationId === state.currentConversationId) {
      switch (data.changeType) {
        case CHANGE_TYPE.Insert:
          const tmpMessage = { ...message };
          state.messages.unshift(tmpMessage);
          const convIndex = state.convs.findIndex(x => x.id === message.conversationId);
          if (convIndex !== -1) {
            markConversationAsRead(state.convs[convIndex].id, state.isFocused);
          }
          state.convs.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : b.updatedAt < a.updatedAt ? -1 : 0));
          break;
        case CHANGE_TYPE.Update:
          console.log('Update');
          let foundMessage = state.messages.find(x => x.localId === message.localId);
          if (foundMessage) {
            foundMessage.state = message.state;
          }
          break;
        case CHANGE_TYPE.Delete:
          foundMessage = state.messages.findIndex(x => x.localId === message.localId);
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
   [updateUserInfo.fulfilled]:(state,action)=>{
      state.userInfo=action.payload;
      return state
    },

    [updateUserStringee.fulfilled]: (state, action) => {
      state.stringeeUser =action.payload;
      return state
    },

    [getListConvs.pending]:(state,action)=>{
    state.isConvsLoading=true;
    return state;
    },

    [getListConvs.rejected]:(state,action)=>{
    state.isConvsLoading=false;
    state.isConvsError=true;
    return state
    },

    [getListConvs.fulfilled]:(state,action)=>{
    state.isConvsLoading=false;
    state.convs=action.payload.data;
    if (action.payload.payload && typeof action.payload.payload == 'function') {
      action.payload.payload();
    }
    if (state.currentConversationId === -1 && state.convs.length > 0) {
      state.currentConversationId = state.convs[0].id;
    }
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

  [onObjectChange.fulfilled]:(state,action)=>{
    if (action.payload.objectType === OBJECT_TYPE.Conversation) {
      updateConvs(state, action.payload);
    } else {
      updateMes(state, action.payload);
    }
  },

  [markConversation.fulfilled]: (state, action) => {
    var newArr = [...state.convs];
    var index = newArr.findIndex(value => value.id == action.payload.id);
    newArr[index].unreadCount = 0;
    state.convs = newArr;
    return state;
  },
  },
});

export const {actions, reducer} = countSlice;
export const { reset } = actions;
export default reducer;
