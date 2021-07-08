import {configureStore} from '@reduxjs/toolkit';
// import ChatSilce from '../reducers/ChatSilce';
export default configureStore({
  reducer: {
    // chatReducer: ChatSilce,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
