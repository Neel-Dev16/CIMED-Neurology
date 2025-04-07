import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FaTwitter, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa"
import "./Login.css";


const Login = () => {
    const [universityEmail, setUniversityEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
  
    const handleLogin = async (event) => {
      event.preventDefault()
      setErrorMessage("") // Clear any previous error messages
  
      try {
        const response = await axios.post(
          "http://localhost:5001/api/login",
          {
            university_email: universityEmail,
            password,
          },
          { withCredentials: true },
        )
  
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log("Login successful:", response.data)
        navigate("/search")
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage("User not registered. Please sign up first.")
        } else if (error.response && error.response.status === 401) {
          setErrorMessage("Invalid credentials. Please try again.")
        } else if (error.response && error.response.data.message) {
          setErrorMessage(error.response.data.message)
        } else {
          setErrorMessage("An error occurred. Please try again.")
        }
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
  
        {/* LOGIN FORM SECTION */}
        <main className="login-section">
          <div className="form-overlay"></div>
          <div className="form-container">
            <div className="form-card">
              <h2 className="form-title">User Login</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
  
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="universityEmail">University Email</label>
                  <input
                    type="email"
                    id="universityEmail"
                    placeholder="Enter university email"
                    value={universityEmail}
                    onChange={(e) => setUniversityEmail(e.target.value)}
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
  
                <button type="submit" className="submit-button">
                  Login
                </button>
              </form>
  
              <p className="form-footer">
                Don't have an account?{" "}
                <button className="link-button" onClick={() => navigate("/register")}>
                  Sign Up
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
  
  export default Login

/*const Login = () => {
    const [universityEmail, setUniversityEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        setErrorMessage(""); // Clear any previous error messages

        try {
            const response = await axios.post(
                "http://localhost:5001/api/login",
                {
                    university_email: universityEmail,
                    password,
                },
                { withCredentials: true }
            );

            localStorage.setItem("user", JSON.stringify(response.data.user));
            console.log("Login successful:", response.data);
            navigate("/search");
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setErrorMessage("User not registered. Please sign up first.");
            } else if (error.response && error.response.status === 401) {
                setErrorMessage("Invalid credentials. Please try again.");
            } else if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="centered-container">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} md={6}>
                        <h2 className="text-center mb-4">User Login</h2>
                        {errorMessage && (
                            <p className="text-danger text-center">{errorMessage}</p>
                        )}
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>University Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter university email"
                                    value={universityEmail}
                                    onChange={(e) => setUniversityEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Login
                            </Button>
                        </Form>

                        <p className="text-center mt-3">
                            Don't have an account?{" "}
                            <Button variant="link" onClick={() => navigate("/register")}>
                                Sign Up
                            </Button>
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
*/