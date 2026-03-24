import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Database } from 'lucide-react'; // Import the icon for the header

const AddWarehouseModal = ({ show, handleClose, onAdd }) => {
  const [wData, setWData] = useState({ name: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(wData);
    setWData({ name: '', location: '' }); // Reset form
  };

  // Custom styles to match the "Obsidian" UI look
  const obsidianStyles = {
    content: {
      backgroundColor: '#161925', // Deep midnight blue
      border: 'none',
      borderRadius: '12px',
      padding: '10px'
    },
    input: {
      backgroundColor: '#222634', // Lighter vault blue for fields
      border: '1px solid #2d3346',
      color: '#ffffff',
      padding: '12px',
      fontSize: '0.95rem'
    },
    label: {
      color: '#9ba1b0',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '8px'
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <div style={obsidianStyles.content} className="text-white shadow-lg">
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="fs-5 d-flex align-items-center gap-2">
            <Database size={20} className="text-warning" /> 
            Primary Details
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-4">
            {/* Warehouse Name Field */}
            <Form.Group className="mb-4">
              <Form.Label style={obsidianStyles.label}>Warehouse Name</Form.Label>
              <Form.Control 
                required
                style={obsidianStyles.input}
                placeholder="e.g., Jamshedpur Logistics Hub"
                value={wData.name}
                onChange={(e) => setWData({...wData, name: e.target.value})}
              />
            </Form.Group>

            {/* Location Field */}
            <Form.Group className="mb-3">
              <Form.Label style={obsidianStyles.label}>Vault Location</Form.Label>
              <Form.Control 
                required
                style={obsidianStyles.input}
                placeholder="e.g., Bistupur Sector 4"
                value={wData.location}
                onChange={(e) => setWData({...wData, location: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0">
            <Button 
              variant="link" 
              className="text-secondary text-decoration-none" 
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-4 py-2"
              style={{ backgroundColor: '#f3ba2f', border: 'none', color: '#000', fontWeight: 'bold' }}
            >
              Save Warehouse
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default AddWarehouseModal;