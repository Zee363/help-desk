import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, setError, loginFailure } from '../redux/slices/authSlice';
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '', role: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);


  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch loading state
    dispatch(setLoading(true));

  try {
        const response = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(setError(errorData.message || 'Signup failed'));
        throw new Error('Signup failed');
      }

      const data = await response.json();
      dispatch(setUser(data.user));

      navigate('/login');
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
  };

  return (
    <div className="signup-wrapper">
      <div className="left-panel">
        <div className="branding">
          <h1>HelpDesk Pro</h1>
          <p>Your go-to place for instant support</p>
        </div>
      </div>
      <div className="right-panel">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className='signup-h2'>Sign Up</h2>
          <p>Join us today to manage your support tickets easily.</p>

          <label>Full name</label>
          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

           <span className="last-buttons">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Sign Up</button>
            <p className="button-par text-white">Already have an account? {""}<Link to={"/login"}>Login</Link></p>
            </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
