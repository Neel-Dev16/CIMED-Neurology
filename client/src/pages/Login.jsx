import React, { useState } from "react";
import axios from "axios"; // Import Axios for API calls
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./Login.css";

const Login = () => {
    const [universityEmail, setUniversityEmail] = useState(""); // State for email input
    const [password, setPassword] = useState(""); // State for password input
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages
    const navigate = useNavigate(); // For navigation

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent form submission default behavior

        try {
            // Send login data to backend
            const response = await axios.post(
                "http://localhost:5001/api/login", // Backend login endpoint
                {
                    university_email: universityEmail,
                    password,
                },
                { withCredentials: true } // Include credentials (cookies) in the request
            );

            // Store user details in localStorage
            localStorage.setItem("user", JSON.stringify(response.data.user));

            console.log("Login successful:", response.data);

            // Redirect to the search page after successful login
            navigate("/search");
        } catch (error) {
            // Handle errors (e.g., invalid credentials)
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message); // Display error message from backend
            } else {
                setErrorMessage("An error occurred. Please try again."); // Generic error message
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
                            {/* Email Field */}
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
                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Login
                            </Button>
                        </Form>

                        {/* Admin Panel Button */}
                        <Button 
                            variant="secondary" 
                            className="w-100" 
                            onClick={() => navigate("/admin-panel")}
                        >
                            Admin Panel
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Login;
