import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Helper to get token from localStorage
const authToken = () => {
  return localStorage.getItem('token');
};

export const fetchTickets = createAsyncThunk("tickets/fetchTickets", async (_, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch tickets"); 
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

//Fetch user-specific tickets
export const fetchUserTickets = createAsyncThunk('tickets/fetchUserTickets', async (_, { rejectWithValue}) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found");
        }

        // Decode token to get userId
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/user-tickets/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            }
        });

         if (!response.ok) {
        throw new Error('Failed to fetch user tickets');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to create ticket
export const createTicket = createAsyncThunk("tickets/createTicket", async (ticketData, thunkAPI) => {
    try {
        const token = authToken();
        
        if(!token) {
            throw new Error("No authentication token found");
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                ...ticketData,
                 createdBy: userId,
                })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to create ticket");
        }

        const data = await response.json();
        return data.ticket;

    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Unknown error occurred");
    }
});

// Update existing ticket
export const updateTicket = createAsyncThunk("tickets/updateTicket", async({ ticketId, updateData }, thunkAPI) =>  {
    try {
        const token = authToken();

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to update ticket");
        }
        
        const data = await response.json();
        return data.ticket || data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Update ticket status specifically
export const updateTicketStatus = createAsyncThunk("tickets/updateTicketStatus", async ({ ticketId, status}, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/${ticketId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to update ticket status");
        }
        
        const data = await response.json();
        return data.ticket || data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Delete ticket
export const deleteTicket = createAsyncThunk("tickets/deleteTicket", async (ticketId, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch(`${process.env.BACKEND_URL}/api/tickets/${ticketId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to delete ticket");
        }

        return ticketId; //Return the deleted ticket ID
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Helper functions to apply filters
const applyFilters = (tickets, filters) => {
  return tickets.filter(ticket => {
    return (
      (filters.status === 'all' || ticket.status === filters.status) &&
      (filters.priority === 'all' || ticket.priority === filters.priority) &&
      (filters.category === 'all' || ticket.category === filters.category)
    );
  });
};

// Helper functions to calculate stats
const calculateStats = (tickets) => {
    const stats = {
        total: tickets.length,
        open: 0,
        inProgress: 0,
        pending: 0, 
        resolved: 0
};

tickets.forEach(ticket => {
    switch (ticket.status) {
        case "Open":
            stats.open++;
            break;
        case "InProgess":
        case "InProgress":
            stats.inProgress++;
            break;
        case "Pending": 
            stats.pending++;
            break;
        case "Resolved": 
        stats.resolved++;
            break;
    }
});

return stats;
};

const initialState = {
    tickets: [],
    userTickets: [],
    filteredTickets: [],
    selectedTicket: null,
    filters: {
        status: "all",
        priority: "all",
        category: "all"
    },
    stats: {
        total: 0,
        open: 0,
        inProgress: 0,
        pending: 0,
        resolved: 0
    },
    loading: false,
    error: null
};

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setFilters: (state, action) => {
        state.filters = { ...state.filters, ...action.payload};
        state.filteredTickets = applyFilters(state.tickets, state.filters);
    },

    // Clear error state
    clearError: (state) => {
        state.error = null;
    },

    setSelectedTickets: (state, action) => {
      state.selectedTicket = action.payload;
    },

    clearSelectedTicket: (state) => {
      state.selectedTicket = null;   
    },


    resetFilters: (state) => {
        state.filters = {
            status: "all",
            priority: "all",
            category: "all"
        };
        state.filteredTickets = state.tickets;
    },

    // Manual status update (if needed)
    updateStats: (state) => {
        state.stats = calculateStats(state.tickets);
    }
 },
   extraReducers: (builder) => {
    builder
    // Fetch tickets
    .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
        state.filteredTickets = applyFilters(action.payload, state.filters);
        state.stats = calculateStats(action.payload);
    })
    .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    // Create ticket
    .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
        state.userTickets.push(action.payload);
        state.filteredTickets = applyFilters(state.tickets, state.filters);
        state.stats = calculateStats(state.tickets);
    })
    .addCase(createTicket.rejected, (state, action) =>{
        state.loading = false;
        state.error = action.payload;
    })

    // Fetch User tickets
    .addCase(fetchUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.userTickets = action.payload;
    })
    .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    // Update ticket
    .addCase(updateTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(updateTicket.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTicket = action.payload;

        // Update generally
        const ticketIndex = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
        if (ticketIndex !== -1) {
            state.tickets[ticketIndex] = updatedTicket;
        }


        // Update in user tickets
        const userTicketIndex = state.userTickets.findIndex(ticket => ticket._id === action.payload._id);
        if (userTicketIndex !== -1) {
            state.userTickets[userTicketIndex] = action.payload;
        }

        // Upadate filtered tickets
        state.filteredTickets = applyFilters(state.tickets, state.filters);
        state.stats = calculateStats(state.tickets);

        // Update selected ticket if it's the one being updated
        if (state.selectedTicket && state.selectedTicket._id === action.payload._id) {
            state.selectedTicket = action.payload;
        }

        state.stats = calculateStats(state.tickets);
    })
    .addCase(updateTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })

    // Update ticket status
    .addCase(updateTicketStatus.pending, (state) => {
        state.error = null;
    })
    .addCase(updateTicketStatus.fulfilled, (state, action) => {
        // Update generally
        const ticketIndex = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
        if (ticketIndex !== -1) {
            state.tickets[ticketIndex] = action.payload;
        }

        // Update in user tickets
        const userTicketIndex = state.userTickets.findIndex(ticket => ticket._id === action.payload._id);
        if (userTicketIndex !== -1) {
            state.userTickets[userTicketIndex] = action.payload;
        }

        // Update filtered tickets
        state.filteredTickets = applyFilters(state.tickets, state.filters);
        state.stats = calculateStats(state.tickets);

        // Update selected ticket
        if (state.selectedTicket && state.selectedTicket._id === action.payload._id) {
            state.selectedTicket = action.payload;
        }
    })
    .addCase(updateTicketStatus.rejected, (state, action) => {
        state.error = action.payload;
    })

    // Delete ticket
    .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = state.tickets.filter(ticket => ticket._id !== action.payload);
        state.userTickets = state.userTickets.filter(ticket => ticket._id !== action.payload);
        state.filteredTickets = applyFilters(state.tickets, state.filters);
        state.stats = calculateStats(state.tickets);

        // Clear selected ticket that is to be deleted
        if (state.selectedTicket && state.selectedTicket._id === action.payload) {
            state.selectedTicket = null;
        }
    })
    .addCase(deleteTicket.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload;
    });
   }
});

export const {
    clearError,
    setSelectedTicket,
    clearSelectedTicket,
    setFilters,
    resetFilters,
    updateStats
} = ticketSlice.actions;

export default ticketSlice.reducer;

// Selectors 
export const selectAllTickets  = (state) => state.tickets.tickets;

export const selectFilteredTickets = (state) => {
    const { tickets, filters } = state.tickets;
    return applyFilters(tickets, filters);
    };

export const selectTicketById = (state, ticketId) => {
    return state.tickets.tickets.find(ticket => ticket._id === ticketId);
};

export const selectUserTickets = (state) => state.tickets.userTickets;

export const setSelectedTickets = (state) => state.tickets.selectedTicket;

export const selectTicketStats = (state) => state.tickets.stats;

export const selectTicketFilters = (state) => state.tickets.filters;

export const selectTicketLoading = (state)=> state.tickets.loading;

export const selectTicketError = (state)=> state.tickets.error;
