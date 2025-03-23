import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import axios from "axios";

const SearchPage = () => {
  const location = useLocation(); // Access state passed when navigating back
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || "");
  const [filterColumn, setFilterColumn] = useState(location.state?.filterColumn || "all");
  const [results, setResults] = useState(location.state?.results || []);
  const [userName, setUserName] = useState(""); // State to store user's first name
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.first_name); // Set user's first name
    } else {
      navigate("/login"); // Redirect to login if no user is found
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/projects/search", {
        searchTerm,
        filterColumn,
      });

      setResults(response.data); // Update results with data from backend

    } catch (error) {
      console.error("Error during search:", error);
      setResults([]); // Clear results on error
    }
  };

  return (
    <div className="centered-container">
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="text-center">Welcome {userName}!</h2>
            <Button variant="danger" className="float-end" onClick={() => navigate("/login")}>
              Logout
            </Button>
          </Col>
        </Row>

        <Form onSubmit={handleSearch}>
          <Row className="justify-content-center align-items-center mb-4">
            <Col xs={12} md={6}>
              <Form.Control 
                type="text" 
                placeholder="Enter search term" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </Col>

            <Col xs={12} md={3}>
              <Form.Select 
                value={filterColumn} 
                onChange={(e) => setFilterColumn(e.target.value)}
              >
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="keywords">Keywords</option>
                <option value="needs_statement">Needs Statement</option>
                <option value="solution">Solution</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={2}>
              <Button type="submit" variant="primary" className="w-100">
                Search
              </Button>
            </Col>
          </Row>
        </Form>

        {results.length > 0 && (
          <>
            <p>Total Results: {results.length}</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Keywords</th>
                  <th>Needs Statement</th>
                  <th>Solution</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr 
                    key={item.project_id} 
                    onClick={() =>
                      navigate(`/project/${item.project_id}`) // Navigate to Project Details page
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {/* Render highlighted text */}
                    <td dangerouslySetInnerHTML={{ __html: item.title }}></td>
                    <td dangerouslySetInnerHTML={{ __html: item.keywords }}></td>
                    <td dangerouslySetInnerHTML={{ __html: item.needs_statement }}></td>
                    <td dangerouslySetInnerHTML={{ __html: item.solution }}></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </div>
  );
};

export default SearchPage;
