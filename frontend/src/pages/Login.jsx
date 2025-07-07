import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import '../styles/Login.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

   // Local state for email and password
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');

   const handleLogin = async (e) => {
     e.preventDefault();

      // Dispatch login start action
     dispatch(loginStart());

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
          dispatch(loginFailure(errorData.message || 'Login failed'));
         return;
       }

       const data = await response.json();
       localStorage.setItem('token', data.token);
       dispatch(loginSuccess({ user: data.user, token: data.token }));
       alert('Login successful!');
       console.log('User data:', data);

       // Navigate based on role
      if (data.user.role === "admin") {
      navigate("/admin/dashboard");
     } else {
      navigate("/user/dashboard");
     }
     } catch (error) {
       console.error("Error:", error);
       dispatch(loginFailure(error.message || 'Login failed'));
       alert('Login failed. Please try again.');
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
          <h2 className='signup-h2'>Login</h2>
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