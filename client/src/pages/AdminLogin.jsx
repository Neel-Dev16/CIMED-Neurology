import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (event) => {
    event.preventDefault();

    // Mock admin login validation (replace with actual backend API call later)
    if (username === "admin" && password === "admin123") {
      navigate("/admin-panel"); // Redirect to Admin Panel Page
    } else {
      setErrorMessage("Invalid admin credentials. Please try again.");
    }
  };

  return (
    <div className="centered-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h2 className="text-center mb-4">Admin Login</h2>
            {errorMessage && (
              <p className="text-danger text-center">{errorMessage}</p>
            )}
            <Form onSubmit={handleAdminLogin}>
              {/* Username Field */}
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password Field */}
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

              {/* Submit Button */}
              <Button variant="primary" type="submit" className="w-100">
                Login as Admin
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
