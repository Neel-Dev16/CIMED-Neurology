import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import axios from "axios";

const ProjectDetails = () => {
  const { id } = useParams(); // Extract project ID from URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null); // State to store project details
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  useEffect(() => {
    // Fetch project details when component mounts
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/projects/${id}`);
        setProject(response.data); // Store project details in state
      } catch (error) {
        console.error("Error fetching project details:", error);
        setErrorMessage("Failed to load project details. Please try again later.");
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (errorMessage) {
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <p className="text-danger text-center">{errorMessage}</p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container className="mt-4">
        <Row>
          <Col>
            <p className="text-center">Loading project details...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Project Details</h2>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <th>Title</th>
                <td>{project.title}</td>
              </tr>
              <tr>
                <th>Keywords</th>
                <td>{project.keywords}</td>
              </tr>
              <tr>
                <th>Observation</th>
                <td>{project.observation}</td>
              </tr>
              <tr>
                <th>Scoping</th>
                <td>{project.scoping}</td>
              </tr>
              <tr>
                <th>Needs Statement</th>
                <td>{project.needs_statement}</td>
              </tr>
              <tr>
                <th>State of Art</th>
                <td>{project.state_of_art}</td>
              </tr>
              <tr>
                <th>Solution</th>
                <td>{project.solution}</td>
              </tr>
              <tr>
                <th>Solution Category</th>
                <td>{project.solution_category}</td>
              </tr>
              <tr>
                <th>Literature</th>
                <td>{project.literature}</td>
              </tr>
              <tr>
                <th>Acknowledgements</th>
                <td>{project.acknowledgements}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>{new Date(project.created_at).toLocaleString()}</td> {/* Format date */}
              </tr>
            </tbody>
          </Table>

          {/* Back Button */}
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back to Search
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectDetails;
