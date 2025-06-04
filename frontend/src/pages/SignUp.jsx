import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });

  const navigate = useNavigate();
  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

  try {
                const response = await fetch("http://localhost:5002/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Signup failed:', errorData);
                    throw new Error('Signup failed');
                  }

                const data = await response.json();
                console.log(data);
 
                navigate('/login');
            }
            catch (error) {
                console.error("Error:", error);
            }
        }

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
          <h2>Sign Up</h2>
          <p>Join us today to manage your support tickets easily.</p>

          <label>Full name</label>
          <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

           <span className="last-buttons">
            <button type="submit">Sign Up</button>
            <p className="button-par text-white">Already have an account? {""}<Link to={"/login"}>Login</Link></p>
            </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
