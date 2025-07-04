import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; 

const Header = () => {
    return (
        <div className="header">
            <h1>HelpDesk Pro</h1>
                <ul>
                    <li><Link to="/tickets">Track Ticket</Link></li>
                    <li><Link to="/responses">View Responses</Link></li>
                </ul>  
    </div>
    )
};

export default Header;