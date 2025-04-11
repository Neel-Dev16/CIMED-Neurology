import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";  // Import the new Register component
import SearchPage from "./pages/SearchPage";
import AdminPanel from "./pages/AdminPanel";
import AddEntry from "./pages/AddEntry";
import ProjectDetails from "./pages/ProjectDetails";

console.log("AdminPanel component:", AdminPanel);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />  {/* New Register route */}

        {/* Semi-protected Routes (basic checks only) */}
        <Route path="/search" element={<SearchPage />} />
        <Route 
          path="/admin-panel" 
          element={
            (() => {
              const user = JSON.parse(localStorage.getItem("user"));
              console.log("Admin panel route accessed, user:", user);
              return user?.role === "admin" ? <AdminPanel /> : <Navigate to="/search" />;
            })()
          } 
        />
        <Route 
          path="/admin-panel/add-entry" 
          element={
            JSON.parse(localStorage.getItem("user"))?.role === "admin" 
              ? <AddEntry /> 
              : <Navigate to="/search" />
          } 
        />

        {/* Dynamic Route */}
        <Route path="/project/:id" element={<ProjectDetails />} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
