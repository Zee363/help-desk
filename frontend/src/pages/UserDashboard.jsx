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
    description: ''
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
    const ticketData = {...formData, userId: user?._id, userEmail: user?.email, status: 'Open', createdAt: new Date().toISOString()} ;
    console.log("Ticket data being sent:", ticketData);

       await dispatch(createTicket(formData)).unwrap(); // unwrap to catch any errors
      
       //Reset form
       setFormData({
        subject: '',
        priority: '',
        category: '',
        description: ''
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
        <h2>Welcome back {user?.name ?`, ${user.name}` : ''}</h2>
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

      <label>Descripton:</label>
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
      {error && <p className="error">{error}</p>}
    </form>
  )}

    {!loading && tickets.length > 0 && (
      <div className="ticket-list">
      <h3>Your Tickets</h3>
      <div className='tickets-container'>
        {tickets.map((ticket) => (
        <div key={ticket._id} className="ticket-item"><strong>{ticket.subject}</strong> 
        <div className='ticket-header'>
        <span className={`status ${ticket.status?.toLowerCase()}` }>{ticket.status} </span>
        </div>
        <div className='ticket-details'>
          <span className='priority'>Priority: {ticket.priority}</span>
          <span className='category'>Category: {ticket.category}</span>
          <span className='date'>
            Created: {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
        ))}
    </div>
  </div>
    )}
      

    {!loading && tickets.length === 0 && (
      <div className='no-tickets'>
        <p>You have not created any tickets yet.</p>
        </div>
    )}
    {loading && <p>Loading tickets...</p>}
        </div>
        </div>
    );
};

export default UserDashboard;
