import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import axios from "axios";

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/admin/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/projects/${id}`);
        setProjects(projects.filter(project => project.project_id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
        setError("Failed to delete project");
      }
    }
  };

  const handleEdit = (id) => {
    setEditRowId(id);
    const projectToEdit = projects.find(project => project.project_id === id);
    setFormData(projectToEdit);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/projects/${id}`, formData);
      setProjects(projects.map(project => 
        project.project_id === id ? { ...project, ...formData } : project
      ));
      setEditRowId(null);
    } catch (error) {
      console.error("Error updating project:", error);
      setError("Failed to update project");
    }
  };

  const displayColumns = [
    "title", "keywords", "observation", "scoping", "needs_statement", 
    "state_of_art", "solution", "solution_category", "literature", "acknowledgement"
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Admin Panel</h2>
        <Button variant="success" onClick={() => navigate("/admin-panel/add-entry")}>
          +
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* New div to display total count */}
      <div className="mb-3">
        <strong>Total Entries: {projects.length}</strong>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            {displayColumns.map(column => (
              <th key={column}>{column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.project_id}>
              <td>{index + 1}</td>
              {displayColumns.map(column => (
                <td key={`${project.project_id}-${column}`}>
                  {editRowId === project.project_id ? (
                    <Form.Control
                      type="text"
                      name={column}
                      value={formData[column] || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    project[column]
                  )}
                </td>
              ))}
              <td>
                {editRowId === project.project_id ? (
                  <Button variant="success" size="sm" onClick={() => handleSubmit(project.project_id)}>
                    Submit
                  </Button>
                ) : (
                  <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => handleEdit(project.project_id)}
                  >
                    Edit
                  </Button>
                )}
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(project.project_id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminPanel;
