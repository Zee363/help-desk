import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, createTicket } from '../redux/slices/ticketSlice'; 
import Header from '../components/Header';
import '../styles/UserDashboard.css'; 

const UserDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
    subject: '',
    priority: '',
    category: '',
    dateCreated: ''
  });

  const dispatch = useDispatch();
  const { tickets, loading, error } = useSelector((state) => state.tickets);


  // Get token from localStorage
  const authToken = () => {
    return localStorage.getItem('token');
  };

  const fetchUserData = async () => {
    try {
      const token = authToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5002/api/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Error fetching user data:', err);
      return null;
    }
  };

 
//  Fetch user data whe the components firstloads
useEffect(() => {
    const fetchData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        dispatch(fetchTickets());
      }
    };

    fetchData();
  }, [dispatch]);



  const handleChange = async(e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
   
    try {
       await dispatch(createTicket(formData)).unwrap(); // unwrap to catch any errors
      setFormData({
        subject: '',
        priority: '',
        dateCreated: '',
        category: ''
      });
      setShowForm(false);
      alert('Ticket created successfully!');
    } catch (err) {
      alert(err || 'Failed to create ticket');
    }
  };


    return (
        <div className="user-dashboard">
        <Header />
        <div className="main-context">
        <div className="headings">
            <h3>HelpDesk Pro</h3> 
            <h3 className="second-heading">User Dashboard</h3>
        </div>
        <h2>Welcome back</h2>
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

      <label>Category:</label>
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select category</option>
        <option value="technical">Technical</option>
        <option value="account">Account</option>
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

      <label>Date Created:</label>
      <input
        type="date"
        name="dateCreated"
        value={formData.dateCreated}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit Ticket</button>

      {error && <p className="error">{error}</p>}
    </form>
  )}

    {!loading && tickets.length > 0 && (
      <div className="ticket-list">
      <h3>Your Tickets</h3>
      <ul>
      {tickets.map((ticket) => (
        <li key={ticket._id}><strong>{ticket.subject}</strong> - {ticket.priority} - {ticket.category}</li>
      ))}
      </ul>
      </div>
    )}

    {loading && <p>Loading...</p>}
        </div>
        </div>
    );
};

export default UserDashboard;
