import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ show, handleClose, onConfirm, productName }) => {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered 
      contentClassName="inventory-card border-danger text-white"
    >
      <Modal.Body className="p-4 text-center">
        <div className="mb-3 text-danger">
          <AlertTriangle size={48} />
        </div>
        <h5 className="mb-2 fw-bold">Delete Product?</h5>
        <p className="text-secondary small">
          Are you sure you want to delete <strong>{productName}</strong>? 
          This action cannot be undone.
        </p>
        <div className="d-flex gap-3 justify-content-center mt-4">
          <Button 
            variant="outline-secondary" 
            className="px-4" 
            onClick={handleClose}
          >
            No, Cancel
          </Button>
          <Button 
            variant="danger" 
            className="px-4" 
            onClick={onConfirm}
          >
            Yes, Delete
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirmModal;