import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddWarehouseModal = ({ show, handleClose, onAdd }) => {
  const [wData, setWData] = useState({ name: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(wData);
    setWData({ name: '', location: '' }); // Reset form
  };

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-white border-secondary">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title>Add Warehouse</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="small text-secondary">Warehouse Name</Form.Label>
            <Form.Control 
              required
              className="bg-dark text-white border-secondary"
              placeholder="e.g. Jamshedpur Hub"
              onChange={(e) => setWData({...wData, name: e.target.value})}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="small text-secondary">Location</Form.Label>
            <Form.Control 
              required
              className="bg-dark text-white border-secondary"
              placeholder="e.g. Bistupur"
              onChange={(e) => setWData({...wData, location: e.target.value})}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-secondary">
          <Button variant="outline-light" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Warehouse</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddWarehouseModal;