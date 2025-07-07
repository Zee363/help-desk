import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { fetchTickets, createTicket, updateTicketStatus, setFilters, selectFilteredTickets, clearError, deleteTicket } from "../redux/slices/ticketSlice";
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

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null);
  const [editLoading, setEditLoading] = useState(false); 
  const [deleteLoading, setDeleteLoading] = useState(null);

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
  const handleStatusChange = async (ticketId, newStatus) => {
    if (newStatus === "all") return; //prevents setting status to 'all'

    setStatusUpdateLoading(ticketId);
    try {
      await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
    } catch (error) {
      console.error("Failed to update ticket status:", error);
    } finally {
      setStatusUpdateLoading(null);
    };
  };
  
  // Handle view ticket
  const handleViewTicket = (ticket) => {
    console.log("View ticket:", ticket._id);
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

    // Handle delete ticket 
  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket? Ths action is irreversibe.")) {
      setDeleteLoading(ticketId);
      try {
        await dispatch(deleteTicket(ticketId)).unwrap();
        alert("Ticket deleted successfully!");
        
        if (isModalOpen) {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }

        dispatch(fetchTickets());
      } catch (err) {
        alert(err || "Failed to delete ticket");
      } finally {
        setDeleteLoading(null);
      }
    }
  };


  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
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
            <td title={ticket._id.slice(-6)}></td>
            <td title={ticket.subject}>{ticket.subject}</td>
            <td>
              <select value={ticket.status} onChange={(e) => handleStatusChange(ticket._id, e.target.value)} className={getStatusClass(ticket.status)} disabled={statusUpdateLoading === ticket._id}>
                  <option value="Open">Open</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
              </select>
              {statusUpdateLoading === ticket._id && (
                <span className="status-updating">Updating...</span>
              )}
            </td>
            <td>
              <span className={getPriorityClass(ticket.priority)}>{ticket.priority}</span>
            </td>
            <td>{formatDate(ticket.dateCreated || ticket.createdAt)}</td>
            <td>{ticket.category}</td>
            <td className="actions">
              <button className="btn-view" onClick={() => handleViewTicket(ticket)}>View Ticket</button>
              <button className="btn-delete" onClick={() => handleDeleteTicket(ticket._id)} disabled={deleteLoading === ticket._id}>Delete Ticket</button>
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

    {/* Modal for viewing ticket details */}
    {isModalOpen && selectedTicket && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3> Ticket Details</h3>
            <button className="close-button" onClick={closeModal}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="ticket-detail">
              <label>ID:</label>
              <span>{selectedTicket._id}</span>
            </div>
             <div className="ticket-detail">
              <label>Subject:</label>
              <span>{selectedTicket.subject}</span>
            </div>
            <div className="ticket-detail">
              <label>Description:</label>
              <span>{selectedTicket.description}</span>
            </div>
            <div className="ticket-detail">
              <label>Status:</label>
              <span className={getStatusClass(selectedTicket.status)}>{selectedTicket.status}</span>
            </div>
            <div className="ticket-detail">
              <label>Priority:</label>
              <span className={getPriorityClass(selectedTicket.priority)}>{selectedTicket.priority}</span>
            </div>
            <div className="ticket-detail">
              <label>Category:</label>
              <span>{selectedTicket.category}</span>
            </div>
            <div className="ticket-detail">
              <label>CreatedBy:</label>
              <span>{selectedTicket.userEmail}</span>
            </div>
            <div className="ticket-detail">
              <label>Date Created:</label>
              <span>{formatDate(selectedTicket.dateCreated || selectedTicket.createdAt)}</span>
            </div>
           {selectedTicket.updatedAt && (
            <div className="ticket-detail">
              <label>Last Updated:</label>
              <span>{formatDate(selectedTicket.updatedAt)}</span>
            </div>
           )}
          </div>
          <div className="modal-footer">
             <button className="btn-close" onClick={closeModal}>Close</button>
              <button className="btn-delete" onClick={() => handleDeleteTicket(selectedTicket._id)} disabled={deleteLoading === selectedTicket._id}>Delete Ticket</button>
          </div>
        </div>
      </div>
    )}
</div>
    );
};

export default TicketStats;