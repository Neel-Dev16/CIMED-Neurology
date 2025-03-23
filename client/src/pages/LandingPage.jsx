import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Import your CSS file for styling

const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to My Project</h1>
        <p>This project is designed to showcase amazing features and functionality.</p>
      </header>
      <main className="landing-main">
        <img
          src="https://via.placeholder.com/600x400" // Replace with your image URL
          alt="Project Illustration"
          className="landing-image"
        />
        <button className="landing-button" onClick={handleNavigate}>
          Go to Login
        </button>
      </main>
    </div>
  );
};

export default LandingPage;
