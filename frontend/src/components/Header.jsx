import React, { useState, useEffect} from 'react';
import { setInput, fetchAIResponse } from "../redux/slices/aiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import '../styles/Header.css'; 

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Get user token
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUser(decoded);
        } catch (err) {
            console.error("Invalid token:", err);
            localStorage.removeItem("token");
        }
    }
}, []);


     const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/logout');
     };

     const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
     };


    return (
        <div id="header">
            <h1 className='company-name'>HelpDesk Pro</h1>

            <nav>
                <div className='hamburger' onClick={toggleMenu}><FontAwesomeIcon icon={faBars} /></div>


                <ul className={`nav-links ${isMenuOpen ? "open" : ''}`}>
                    <li><Link to="/">Home</Link></li>

                    {user && (
                        <>
                    {user.role === "admin" && (
                    <>
                    <li><Link to="/tickets">Tickets</Link></li>
                     <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                      </>
                    )}
                    <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </>
                    )}

                    {!user && (
                        <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Sign Up</Link></li>
                        </>
                    )}
                </ul> 
            </nav> 
    </div>
    )
};

export default Header;