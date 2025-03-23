import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const AdminTablePage = () => {
  // Mock data
  const [data, setData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Viewer" },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  // Handle Edit Modal
  const handleEdit = (row) => {
    setCurrentRow(row);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === currentRow.id ? currentRow : item
      )
    );
    setShowEditModal(false);
  };

  // Handle Delete Row
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  return (
    <>
      <h2>Manage Data</h2>

      {/* Data Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.role}</td>
              <td>
                {/* Edit Button */}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEdit(row)}
                  className="me-2"
                >
                  Edit
                </Button>

                {/* Delete Button */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(row.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      {currentRow && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>Edit Row</Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={currentRow.name}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentRow.email}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                value={currentRow.role}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, role: e.target.value })
                }
              />
            </Form.Group>

            {/* Save Button */}
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default AdminTablePage;
