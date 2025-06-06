import React, {useState} from 'react';
import Header from '../components/Header';
import '../styles/UserDashboard.css'; 

const UserDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
    subject: '',
    status: '',
    priority: '',
    dateCreated: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Send to backend here
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
          {showForm ? 'Ticket' : 'Request Ticket'}
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
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
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
    </form>
      )}
        </div>
        </div>
    )
};

export default UserDashboard;
