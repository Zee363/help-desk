import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setInput, fetchAIResponse } from "../redux/slices/aiSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import  "../styles/Home.css";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { input, response, loading, error } = useSelector((state) => state.ai);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = input.toLowerCase().trim();

    if(trimmed.includes("support")) {
        navigate("/signup");
    } else{
        dispatch(fetchAIResponse(input));
    }
};

    return (
        <div className="home-container">
            <div className="header">
                <div className="header-content">
                    <div className="logo"><FontAwesomeIcon icon={faRobot} /></div>
                    <h1 className="title">HelpDesk Pro</h1>
                    </div>
        </div>

        <div className="main-content">
            <div className="hero-section">
          <h2 className="main-title">Welcome to HelpDesk Pro!</h2>
          <h3 className="subtitle">Get instant AI-powered support for your technical issues, or connect with our human experts</h3>
          <p className="description">Need help? Ask your question below.</p>
          </div>

          <div className="form-container">
          <form onSubmit={handleSubmit} className="form-content">
            <input value={input} onChange={(e) => dispatch(setInput(e.target.value))} placeholder="Type your issue or 'support' for human assistance" className="instructions"/>
            <button type="submit" className="home-button">{loading ? "Loading..." : "SUBMIT"}</button>
          </form>

          {error && <div className="error-box">Error: {error}</div>}

          {response && (
            <div className="response-container">
                <div className="response-header">
                <strong>AI Assistant:</strong>
                </div>
                <div className="response-content">
                    {response}
                </div>
             </div>
          )}
        </div>
     </div> 
   </div>
  );
};

export default Home;