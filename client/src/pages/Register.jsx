import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa"
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      universityNetId: "",
      universityEmail: "",
      phone: "",
      password: "",
      confirmPassword: "",
    })
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  
    const validateForm = () => {
      const { firstName, lastName, universityNetId, universityEmail, phone, password, confirmPassword } = formData
  
      if (!firstName || !lastName || !universityNetId || !universityEmail || !phone || !password || !confirmPassword) {
        setErrorMessage("All fields are required")
        return false
      }
  
      if (!universityEmail.endsWith("@illinois.edu")) {
        setErrorMessage("Only @illinois.edu emails are allowed")
        return false
      }
  
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match")
        return false
      }
  
      if (!/^\d{10}$/.test(phone)) {
        setErrorMessage("Phone must be 10 digits")
        return false
      }
  
      return true
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setErrorMessage("")
  
      if (!validateForm()) return
  
      try {
        await axios.post("http://localhost:5001/api/register", {
          ...formData,
          role: "student",
          status: "active",
        })
        alert("Registration successful! Redirecting to login...")
        navigate("/login")
      } catch (error) {
        console.error("Registration error:", error)
        setErrorMessage(error.response?.data?.message || "Registration failed")
      }
    }
  
    return (
      <div className="page-wrapper">
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
  
        {/* REGISTER FORM SECTION */}
        <main className="register-section">
          <div className="form-overlay"></div>
          <div className="form-container">
            <div className="form-card">
              <h2 className="form-title">User Registration</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
  
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
  
                <div className="form-group">
                  <label htmlFor="universityNetId">University NetID</label>
                  <input
                    type="text"
                    id="universityNetId"
                    name="universityNetId"
                    value={formData.universityNetId}
                    onChange={handleChange}
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="universityEmail">University Email</label>
                  <input
                    type="email"
                    id="universityEmail"
                    name="universityEmail"
                    value={formData.universityEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
  
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
  
                <button type="submit" className="submit-button">
                  Register
                </button>
              </form>
  
              <p className="form-footer">
                Already have an account?{" "}
                <button className="link-button" onClick={() => navigate("/login")}>
                  Login here
                </button>
              </p>
            </div>
          </div>
        </main>
  
        {/* FOOTER SECTION */}
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-left">
              <a href="/" className="footer-logo-link">
                <img src="/images/footer.png" alt="Carle Illinois College of Medicine Logo" className="footer-logo" />
              </a>
              <div className="social-icons">
              <a href="https://twitter.com/illinoismed" className="social-icon">
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/carleillinoismed/" className="social-icon">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/illinoismed/" className="social-icon">
                <FaFacebook />
              </a>
              <a href="https://www.linkedin.com/company/illinoismed/" className="social-icon">
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
                <a href="https://carleillinoiscollegeofmedicine.as.me/Admissions">Admissions</a>
              </li>
              <li>
                <a href="http://carle.org/">Carle Health</a>
              </li>
              <li>
                <a href="https://medicine.uic.edu/about/urbana/">University of Illinois College of Medicine at Urbana-Champaign</a>
              </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    )
  }
  
  export default Register