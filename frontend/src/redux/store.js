import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ticketReducer from './slices/ticketSlice';
import aiReducer from './slices/aiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    ai: aiReducer,
  },
}); 

export default store;