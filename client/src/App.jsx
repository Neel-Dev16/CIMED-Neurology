import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import SearchPage from "./pages/SearchPage";
import AdminPanel from "./pages/AdminPanel"; // Import AdminPanel component
import AddEntry from "./pages/AddEntry"; // Import AddEntry component
import ProjectDetails from "./pages/ProjectDetails"; // Import Project Details Page
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        
       {/* Public Routes */}
       <Route path="/" element={<LandingPage />} />
       <Route path="/login" element={<Login />} />
       
       {/* Protected Routes */}
       <Route 
         path="/search"
         element={
           <ProtectedRoute>
             <SearchPage />
           </ProtectedRoute>
         }
       />
       <Route 
         path="/admin-panel"
         element={
           <ProtectedRoute>
             <AdminPanel />
           </ProtectedRoute>
         }
       />
       <Route 
         path="/admin-panel/add-entry"
         element={
           <ProtectedRoute>
             <AddEntry />
           </ProtectedRoute>
         }
       />

       {/* Dynamic Route */}
       <Route path="/project/:id" element={<ProjectDetails />} />
     </Routes>
   </Router>
 );
}

export default App;
