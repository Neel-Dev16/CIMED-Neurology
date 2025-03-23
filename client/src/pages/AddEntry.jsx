import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddEntry = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    observation: "",
    scoping: "",
    needs_statement: "",
    state_of_art: "",
    solution: "",
    solution_category: "",
    literature: "",
    acknowledgement: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/admin/projects", formData);
      alert("Entry added successfully!");
      setFormData({
        title: "",
        keywords: "",
        observation: "",
        scoping: "",
        needs_statement: "",
        state_of_art: "",
        solution: "",
        solution_category: "",
        literature: "",
        acknowledgement: ""
      });
      navigate("/admin-panel");
    } catch (error) {
      console.error("Error adding entry:", error);
      alert(`Failed to add entry: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Entry</h2>
        <Button variant="secondary" onClick={() => navigate("/admin-panel")}>
          Back to Admin Panel
        </Button>
      </div>
      
      <Form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <Form.Group key={key} className="mb-3">
            <Form.Label>
              {key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
            </Form.Label>
            <Form.Control 
              as={key === 'observation' ? 'textarea' : 'input'}
              rows={key === 'observation' ? 3 : undefined}
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}
        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" type="submit">
            Submit Entry
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddEntry;
