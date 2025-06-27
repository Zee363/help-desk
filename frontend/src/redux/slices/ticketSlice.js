import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchTickets = createAsyncThunk("tickets/fetchTickets", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;

        const response = await fetch("http://localhost:5002/api/tickets/all", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tickets"); 
        }

        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Async thunk to create ticket
export const createTicket = createAsyncThunk("tickets/createTicket", async (ticketData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;

        const response = await fetch("http://localhost:5002/api/tickets/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ticketData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to create ticket");
        }

        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    loading: false,
  },
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },

    addTicket: (state, action) => {
      state.tickets.push(action.payload);   
},
    updateTicket: (state, action) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
        if (index !== -1) {
            state.tickets[index] = action.payload;
        }
    },
    deleteTicket: (state, action) => {
        state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
    }
    },
});

export const { setTickets, addTicket, updateTicket, deleteTicket } = ticketSlice.actions;
export default ticketSlice.reducer;