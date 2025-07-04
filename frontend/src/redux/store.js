import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticketSlice';
import helpdeskReducer from './slices/helpdeskSlice';
import aiReducer from './slices/aiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    helpdesk: helpdeskReducer,
    ai: aiReducer,
  },
}); 

export default store;