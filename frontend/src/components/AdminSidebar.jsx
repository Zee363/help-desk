import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
        <h2>HelpDesk Pro</h2>
      <h3>Admin Panel</h3>
      <ul>
        <li><FontAwesomeIcon icon={faTicket} /> {'  '}<Link to="/admin/tickets">All Tickets</Link></li>
        <li><FontAwesomeIcon icon={faSquareCheck} />{' '} <Link to="/admin/stats">Ticket Stats</Link></li>
        <li><FontAwesomeIcon icon={faReply} /> {''}<Link to="/admin/respond">Respond</Link></li>
        <li><FontAwesomeIcon icon={faUser} />{' '}<Link to="/admin/profile">Admin Profile</Link></li>
        <li><button className="logout-btn">Logout</button></li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
