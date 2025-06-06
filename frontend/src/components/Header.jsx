import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; 

const Header = () => {
    return (
        <div className="header">
            <h1>Dashboard</h1>
                <ul>
                    <li><Link to="/ticket">Request Ticket</Link></li>
                    <li><Link to="/login">Track Ticket</Link></li>
                    <li><Link to="/signup">View Responses</Link></li>
                </ul>  
    </div>
    )
};

export default Header;