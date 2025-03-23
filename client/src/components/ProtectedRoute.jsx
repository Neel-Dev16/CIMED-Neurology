import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            setIsAuthenticated(!!user); // Set true if user exists, false otherwise
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        // Show a loading spinner while checking authentication
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
