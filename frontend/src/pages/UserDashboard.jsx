import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, createTicket, fetchUserTickets, updateTicket, deleteTicket } from '../redux/slices/ticketSlice'; 
import Header from '../components/Header';
import '../styles/UserDashboard.css'; 
import { jwtDecode } from 'jwt-decode';

const UserDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const [showTickets, setShowTickets] = useState(true);
    const [editingTicket, setEditingTicket] = useState(null);
    const [formData, setFormData] = useState({
    subject: '',
    priority: '',
    category: '',
    description: ''
  });

  const dispatch = useDispatch();
  const { userTickets, loading, error } = useSelector((state) => state.tickets);


  // Get token from localStorage
  const authToken = () => {
    return localStorage.getItem('token');
  };

  const getUserFromToken = async () => {
    try {
      const token = authToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

   const decoded = jwtDecode(token);

   const userId = decoded.id || decoded.userId || decoded.subject || decoded._id;

       return {
         ...decoded,
         id: userId,
       };

    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  };

 
//  Fetch user data when the components firstloads
useEffect(() => {
  const loadUser = async () => {
    try {
    const userData = await getUserFromToken();

       if (userData) {
        const userId = userData.id || userData.userId || userData.subject || userData._id;

        if (userId) {
        dispatch(fetchUserTickets(userId));
       }
      }
    } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, [dispatch]);


  const handleChange = async(e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
   
    try {
     if(editingTicket) {
      // Update existing ticket
      await dispatch(updateTicket({ticketId: editingTicket._id, updateData: formData})).unwrap();
      setEditingTicket(null);
      alert("Ticket updated successfully!")
     } else {
     // Create new ticket
    const ticketData = {...formData, status: "Open"} ;
    console.log("Ticket data being sent:", ticketData);

       await dispatch(createTicket(ticketData)).unwrap(); // unwrap to catch any errors
       alert("Ticket created successfully!")
     }
      
       //Reset form
       setFormData({
        subject: '',
        priority: '',
        category: '',
        description: '',
      });
      setShowForm(false);

      // Refresh tickets
      dispatch(fetchUserTickets());

    } catch (err) {
      alert(err || 'Failed to create ticket');
    }
  };

  const handleTicketRefresh = () => {
    if (user) {
      dispatch(fetchUserTickets());
    }
  };

  const handleUpdateTicket = (ticket) => {
    setEditingTicket(ticket);
    setFormData({
      subject: ticket.subject,
      priority: ticket.priority,
      category: ticket.category,
      description: ticket.description
    });
    setShowForm(true);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket? Ths action is irreversibe.")) {
      try {
        await dispatch(deleteTicket(ticketId)).unwrap();
        alert("Ticket deleted successfully!");

        dispatch(fetchUserTickets());
      } catch (err) {
        alert(err || "Failed to delete ticket");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
    setFormData({
      subject: '',
      priority: '',
      category: '',
      description: ''
    });
    setShowForm(false);
  };


    return (
        <div className="user-dashboard">
        <Header />
        <div className="main-context">
        <div className="headings">
            <h3>HelpDesk Pro</h3> 
            <h3 className="second-heading">User Dashboard</h3>
        </div>
        <h2>Welcome back {user?.name ? `, ${user.name}` : ''}</h2>

        <div className="request-ticket">
            <h3>Request a Ticket</h3>
            <p>Need assistance? Click the button below to request a new support ticket.</p>
            <button className="request-button" onClick={() => setShowForm(prev => !prev)}>
          {showForm ? 'Close Form' : 'Request Ticket'}
        </button>
      </div>

        {showForm && (
          <form className="ticket-form" onSubmit={handleSubmit}>
            <h2>Create Ticket</h2>
    

      <label>Subject:</label>
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
      />

      <label>Description:</label>
      <textarea 
      name='description'
      value={formData.description}
      onChange={handleChange}
      rows="4"  
      />
      
      <label>Category:</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        <option value="Technical">Technical</option>
        <option value="Account">Account</option>
      </select>

      <label>Priority:</label>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        required
      >
        <option value="">Select priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Submit ticket'}
      </button>
      {editingTicket && (
        <button type='button' onClick={handleCancelEdit}>Cancel</button>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  )}

<div className='ticket-section'>
      <h3>Your Tickets</h3>

      <div className='ticket-controls'>
      <p onClick={() => setShowTickets((prev) => !prev)}>
        {showTickets ? "Hide Tickets" : "Show Tickets"}
      </p>
      <button className='refresh-button' onClick={handleTicketRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh Tickets"}
      </button>
    </div>
  </div>

    {loading && <p>Loading tickets...</p>}

    {showTickets && !loading && (
      <>
       {userTickets && userTickets.length > 0 ? (
      <div className="ticket-list">
        <p className='ticket-count'>Total Tickets:{userTickets.length}</p>
     

        {userTickets.map((ticket) => (
        <div key={ticket._id} className="ticket-item">
          <h4>{ticket.subject}</h4> 
          <p className='ticket-description'>{ticket.description}</p>
        <div className='ticket-meta'>
          <span className={`status ${ticket.status?.toLowerCase()}` }>{ticket.status} </span>
          <span className='priority'>Priority: {ticket.priority}</span>
          <span className='category'>Category: {ticket.category}</span>
          <span className='date'>Created:{' '} {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : "Unknown"}</span>
        </div>
        <div className="button-group">
         <button className='update-button' onClick={() => handleUpdateTicket(ticket)} disabled={loading}>Update</button>
         <button className='delete-button' onClick={() => handleDeleteTicket(ticket._id)} disabled={loading}>Delete</button>
         </div>
      </div>
  ))}
    </div>
    ) : (
      <div className='no-tickets'>
        <p>You have not created any tickets yet.</p>
      </div>
    )}
    </>
    )}
    </div>
  </div>
    );
};

export default UserDashboard;
