import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./LandingPage.css"
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa"  
const LandingPage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page-wrapper">
      {/* HEADER SECTION */}
      <header className="site-header">
        <div className="orange-top-bar"></div>
        <div className="header-content">
          <a href="https://illinois.edu/" className="university-link">
            <div className="illinois-logo-box">
              <img src="/images/illinois.png" alt="Illinois Logo" className="illinois-logo" />
            </div>
            <div className="university-name">UNIVERSITY OF ILLINOIS URBANA-CHAMPAIGN</div>
          </a>
          <a href="/" className="college-name-link">
            <h1 className="college-name">Carle Illinois College of Medicine</h1>
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" style={{ backgroundImage: `url('/images/LandingPage.webp')` }}>
        <div className="hero-overlay"></div>
        <div className="hero-logos">
          <img src="/images/Carle-Illinois-Logo.png" alt="Carle and Illinois Logos" className="hero-logo-image" />
        </div>
        <div className="hero-content">
          <h2 className="hero-title">
            The forward design of Human Health begins at the world's first engineering-based College of Medicine.
          </h2>
          <button className="primary-button" onClick={handleNavigate}>Go to Login</button>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-left">
            <a href="/" className="footer-logo-link">
              <img src="/images/footer.png" alt="Carle Illinois College of Medicine Logo" className="footer-logo" />
            </a>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
            <div className="contact-info">
              <p>506 South Mathews Ave</p>
              <p>Urbana, IL 61801</p>
              <p>
                Phone: <a href="tel:2173005700">217-300-5700</a>
              </p>
              <p>
                Email: <a href="mailto:medicine@illinois.edu">medicine@illinois.edu</a>
              </p>
            </div>
          </div>
          <div className="footer-right">
            <h3 className="connect-heading">Connect</h3>
            <div className="footer-divider"></div>
            <ul className="connect-links">
              <li>
                <a href="#">Admissions</a>
              </li>
              <li>
                <a href="#">Carle Health</a>
              </li>
              <li>
                <a href="#">University of Illinois College of Medicine at Urbana-Champaign</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
