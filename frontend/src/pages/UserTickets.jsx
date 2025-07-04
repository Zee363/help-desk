import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { fetchTickets, createTicket, updateTicketStatus, setFilters, selectFilteredTickets, clearError } from "../redux/slices/ticketSlice";
import '../styles/TicketStats.css'; 

const TicketStats = () => {
  const dispatch = useDispatch();

  // Fetching data from redux store
  const { stats, loading, error } = useSelector(state => state.tickets);
  const filteredTickets = useSelector(selectFilteredTickets);

  // Local state for filters
  const [filters, setLocalFilters] = useState({
    status: "all",
    priority: "all",
    category: "all"
  });

  // Fetch tickets on component mount
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  // Handle status change for individual tickets
  const handleStatusChange = (ticketId, newStatus) => {
    dispatch(updateTicketStatus({ ticketId, status: newStatus}));
  };

  // Clear error when component unmounts or when needed
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get priority class for styling
  const getPriorityClass = (priority) => {
    return `priority ${priority.toLowerCase()}`;
  };

  // Get status class for styling
  const getStatusClass = (status) => {
    return `status ${status.toLowerCase().replace(' ', '-')}`;
  };

  if (loading && filteredTickets.length === 0) {
    return (
      <div className="ticket-stats">
        <div className="loading-spinner">
          <p>Loading tickets...</p>
        </div>
      </div>
    );
  }

    return (
        <div className="ticket-stats">
            <div className="headings">
            <h3>HelpDesk Pro</h3> 
            <h3 className="second-heading">Admin Dashboard</h3>
            </div>

            {/* Error Display */}
            { error && (
              <div className="error-message">
                <p>Error: {error}</p>
                <button onClick={() => dispatch(clearError())}>Dismiss</button>
              </div>
            )}

            {/* Dynamic stats from redux */}
        <div className="ticket-info">
          <div className="total">
            <h4>Total</h4>
            <p>{stats.total}</p>
        </div>
            <div className="open">
                <h4>Open</h4>
                <p>{stats.open}</p>
            </div>
            <div className="in-progress">
                <h4>In Progress</h4>
                <p>{stats.inProgress}</p>
            </div>
            <div className="pending">
                <h4>Pending</h4>
                <p>{stats.pending}</p>
            </div>
            <div className="resolved">
            <h4>Resolved</h4>
                <p>{stats.resolved}</p>
            </div>
            </div>
 
            <div className="dashboard-header">
            <h2>Admin Ticket Dashboard</h2>

            {/* Filter controls */}
            <div className="filter-controls">
              <div className="filter-group">
                <label>Status:</label>
                <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
             
             <div className="filter-group">
              <label>Priority:</label>
              <select value={filters.priority} onChange={(e) => handleFilterChange('priority', e.target.value)}>
                <option value="all">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
             </div>

           <div className="filter-group">
            <label>Category:</label>
            <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
            </select>
           </div>

            <button className="refresh-button" onClick={() => dispatch(fetchTickets())} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
           </div>
            </div>

           <div className="table-container">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Date Created</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
             <tr key={ticket._id}>
            <td>{ticket._id}</td>
            <td title={ticket.subject}>{ticket.subject}</td>
            <td>
              <select value={ticket.status} onChange={(e) => handleStatusChange(ticket._id, e.target.value)} className={getStatusClass(ticket.status)} disabled={loading}>
                <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
              </select>
            </td>
            <td>
              <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
            </td>
            <td>{formatDate(ticket.dateCreated || ticket.createdAt)}</td>
            <td>{ticket.category}</td>
            <td className="actions">
              <button className="btn-view" onClick={() => {
                console.log("View ticket:", ticket._id);
              }}>View</button>
              <button className="btn-edit" onClick={() => { console.log("Edit ticket:", ticket._id)}}>Edit</button>
            </td>
            </tr>
            ))
          ) : (
            <tr>
              <td className="no-tickets">
                {loading ? "Loading tickets..." : "No ticket found"}
              </td>
            </tr>
          )}  
        </tbody>
      </table>
    </div>

    {/* Tickets Count Information */}
    <div className="table-footer">
      <p>Showing {filteredTickets.length} of {stats.total} tickets {filters.status !== "all" && ` (filtered by status: ${filters.status})`}
         {filters.priority !== "all" && ` (filtered by priority: ${filters.priority})`}
          {filters.category !== "all" && ` (filtered by category: ${filters.category})`}
      </p>
    </div>
</div>
    );
};

export default TicketStats;