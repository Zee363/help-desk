import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get token from localStorage
const authToken = () => {
  return localStorage.getItem('token');
};

export const fetchTickets = createAsyncThunk("tickets/fetchTickets", async (_, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch("http://localhost:5002/api/tickets/all", {
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
export const fetchUserTickets = createAsyncThunk('tickets/fetchUserTickets', async ({ userId },{ rejectWithValue}) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5002/api/tickets/user/${userId}`, {
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

// Update existing ticket
export const updateTicket = createAsyncThunk("tickets/updateTicket", async({ ticketId, updateTicket }, thunkAPI) =>  {
    try {
        const token = authToken();

        const response = await fetch(`http://localhost:5002/api/tickets/${ticketId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateTicket),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to update ticket");
        }
        
        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Update ticket status specifically
export const updateTicketStatus = createAsyncThunk("tickets/updateTicketStatus", async ({ ticketId, status}, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch(`http://localhost:5002/api/tickets/${ticketId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status}),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || "Failed to update ticket status");
        }

        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Delete ticket
export const deleteTicket = createAsyncThunk("tickets/deleteTicket", async (ticketId, thunkAPI) => {
    try {
        const token = authToken();

        const response = await fetch(`http://localhost:5002/api/tickets/${ticketId}`, {
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

// Calculate stats from tickets array
const calculateStats = (tickets) => {
    return {
        total: tickets.length,
        open: tickets.filter(tickets => tickets.status === 'Open').length,
        inProgress: tickets.filter(tickets => tickets.status === 'In Progress').length,
        pending: tickets.filter(tickets => tickets.status === 'Pending').length,
        resolved: tickets.filter(tickets => tickets.status === 'Resolved').length,
    };
};

const initialState = {
    tickets: [],
    userTickets: [],
    filteredTickets: [],
    filters: {
        status: "all",
        priority: "all",
        category: "all"
    },
    stats: {
        total: 0,
        open: 0,
        inProgres: 0,
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
        state.filters = action.payload;
        state.filteredTickets = applyFilters(state.tickets, action.payload);
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

    setFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
        state.filters = {
            status: "all",
            priority: "all",
            category: "all"
        };
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
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
        if (index !== -1) {
            state.tickets[index] = action.payload;
        }
        state.stats = calculateStats(state.tickets);

        // Update selected ticket if it's the one being updated
        if (state.selectedTicket && state.selectedTicket._id === action.payload._id) {
            state.selectedTicket = action.payload;
        }
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
        const index = state.tickets.findIndex(ticket => ticket._id === action.payload._id);
        if (index !== -1) {
            state.tickets[index] = action.payload;
        }
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

// Helper functions
const applyFilters = (tickets, filters) => {
  return tickets.filter(ticket => {
    return (
      (filters.status === 'all' || ticket.status === filters.status) &&
      (filters.priority === 'all' || ticket.priority === filters.priority) &&
      (filters.category === 'all' || ticket.category === filters.category)
    );
  });
};

export const {
    clearError,
    setSelectedTicket,
    clearSelectedTicket,
    setFilters,
    resetFilters,
    updateStats
} = ticketSlice.actions;

export default ticketSlice.reducer;

// Selectors for filtered tickets

export const selectFilteredTickets = (state) => {
    const { tickets, filters } = state.tickets;

    return tickets.filter(ticket => {
        const statusMatch = filters.status === "all" || ticket.status === filters.status;
        const priorityMatch = filters.priority === "all" || ticket.priority === filters.priority;
        const categoryMatch = filters.category === "all" || ticket.category === filters.category;

        return statusMatch && priorityMatch && categoryMatch;
    });
};

export const selectTicketById = (state, ticketId) => {
    return state.tickets.tickets.find(ticket => ticket._id === ticketId);
};

export const selectUserTickets = (state)=> state.tickets.userTickets;