import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const ViewTable = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/projects/${id}`);
      setProjects(projects.filter((project) => project.project_id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <>
      <h2>Project Table</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Keywords</th>
            <th>Observation</th>
            <th>Scoping</th>
            <th>Needs Statement</th>
            <th>State of Art</th>
            <th>Solution</th>
            <th>Solution Category</th>
            <th>Literature</th>
            <th>Acknowledgements</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.project_id}>
              {/* Exclude project_id and created_at */}
              {Object.keys(project).map((key) =>
                key !== "project_id" && key !== "created_at" ? (
                  <td key={key}>{project[key]}</td>
                ) : null
              )}
              {/* Edit/Delete Buttons */}
              <td>
                {/* Add your edit functionality here */}
                <Button variant="warning" size="sm" className="me-2">Edit</Button>

                {/* Delete Button */}
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
    </>
  );
};

export default ViewTable;
