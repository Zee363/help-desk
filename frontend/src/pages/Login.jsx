import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(null);

   const handleLogin = async (e) => {
     e.preventDefault();
     setError(null);

     try {
       const response = await fetch("http://localhost:5002/api/auth/login", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ email, password }),
       });

       if (!response.ok) {
         const errorData = await response.json();
         setError(errorData.message || 'Login failed');
         return;
       }

       const data = await response.json();
       alert('Login successful!');
       console.log('User data:', data);
       localStorage.setItem('token', data.token);
       console.log('Token saved:', data.token);
     } catch (error) {
       console.error("Error:", error);
       setError('An error occurred while logging in');
     }
   }

   return (
    <div className="login-wrapper">
      <div className="left-panel">
        <div className="branding">
          <h1>HelpDesk Pro</h1>
          <p>Your go-to place for instant support</p>
        </div>
      </div>
      <div className="right-panel">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <p>Welcome back! Please enter your credentials.</p>
          <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" placeholder="Enter your email address" value={password} onChange={(e) => setPassword(e.target.value)} required  />
           </div>
          <button type="submit">Login</button>
          <p className="button-par text-white">
            Don't have an account? {""} <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
      </div>
   )
}   

export default Login;