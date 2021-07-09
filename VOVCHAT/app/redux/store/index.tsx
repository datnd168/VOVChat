import {configureStore} from '@reduxjs/toolkit';
import Reactotron from '../../../ReactotronConfig';
import ChatSilce from '../reducers/ChatSilce';
const reduxEnhancer = Reactotron.createEnhancer!();
export default configureStore({
  reducer: {
    chatReducer: ChatSilce,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: [reduxEnhancer],
});
