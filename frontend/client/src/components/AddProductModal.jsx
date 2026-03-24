import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Database } from 'lucide-react';

const AddProductModal = ({ show, handleClose, onAdd, editProduct, warehouses }) => {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    sku: '',
    cat: 'Laptops',
    price: '',
    stock: '',
    warehouse: '',
    status: 'IN STOCK',
    color: 'text-success'
  });

  const categories = ['Laptops', 'Networking Gear', 'Peripheral Devices', 'Mobile Technology', 'Server Components'];

  // Custom styles to match the "Vault" UI
  const obsidianStyles = {
    content: {
      backgroundColor: '#161925', // Deep midnight blue
      border: 'none',
      borderRadius: '12px',
      padding: '10px'
    },
    input: {
      backgroundColor: '#222634', // Lighter vault blue
      border: '1px solid #2d3346',
      color: '#ffffff',
      padding: '12px',
      fontSize: '0.9rem'
    },
    label: {
      color: '#9ba1b0',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '8px'
    }
  };

  useEffect(() => {
    if (editProduct) {
      const numericPrice = editProduct.price?.toString().replace(/[^0-9.]/g, '');
      setFormData({ 
        ...editProduct, 
        price: numericPrice,
        warehouse: editProduct.warehouse?._id || editProduct.warehouse || ''
      });
    } else {
      setFormData({
        name: '',
        vendor: '',
        sku: '',
        cat: 'Laptops',
        price: '',
        stock: '',
        warehouse: '',
        status: 'IN STOCK',
        color: 'text-success'
      });
    }
  }, [editProduct, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.warehouse) {
      alert("Please select a warehouse");
      return;
    }
    const stockNum = parseInt(formData.stock) || 0;
    const finalData = {
      ...formData,
      stock: stockNum,
      status: stockNum === 0 ? 'OUT OF STOCK' : stockNum < 10 ? 'LOW STOCK' : 'IN STOCK',
      color: stockNum === 0 ? 'text-danger' : stockNum < 10 ? 'text-warning' : 'text-success',
      price: formData.price.toString().startsWith('₹') ? formData.price : `₹${formData.price}`
    };
    onAdd(finalData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <div style={obsidianStyles.content} className="text-white shadow-lg">
        <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
          <Modal.Title className="fs-5 d-flex align-items-center gap-2">
            <Database size={20} className="text-warning" /> 
            {editProduct ? 'Update Asset' : 'Primary Details'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-4">
            {/* Product Name */}
            <Form.Group className="mb-4">
              <Form.Label style={obsidianStyles.label}>Product Name</Form.Label>
              <Form.Control 
                style={obsidianStyles.input}
                placeholder="e.g., Obsidian Series Chronograph"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                {/* SKU */}
                <Form.Group className="mb-4">
                  <Form.Label style={obsidianStyles.label}>SKU Identification</Form.Label>
                  <Form.Control 
                    style={obsidianStyles.input}
                    placeholder="OBS-2024-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Vendor */}
                <Form.Group className="mb-4">
                  <Form.Label style={obsidianStyles.label}>Vendor Entity</Form.Label>
                  <Form.Control 
                    style={obsidianStyles.input}
                    placeholder="Search suppliers..."
                    value={formData.vendor}
                    onChange={(e) => setFormData({...formData, vendor: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                {/* Category */}
                <Form.Group className="mb-4">
                  <Form.Label style={obsidianStyles.label}>Asset Category</Form.Label>
                  <Form.Select 
                    style={obsidianStyles.input}
                    value={formData.cat}
                    onChange={(e) => setFormData({...formData, cat: e.target.value})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Warehouse */}
                <Form.Group className="mb-4">
                  <Form.Label style={obsidianStyles.label}>Assign Warehouse</Form.Label>
                  <Form.Select 
                    style={obsidianStyles.input}
                    value={formData.warehouse}
                    onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                    required
                  >
                    <option value="">Select vault location...</option>
                    {warehouses && warehouses.map(w => (
                      <option key={w._id} value={w._id}>{w.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                {/* Price */}
                <Form.Group className="mb-3">
                  <Form.Label style={obsidianStyles.label}>Price (INR)</Form.Label>
                  <Form.Control 
                    type="text" 
                    style={obsidianStyles.input}
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                {/* Stock */}
                <Form.Group className="mb-3">
                  <Form.Label style={obsidianStyles.label}>Stock Quantity</Form.Label>
                  <Form.Control 
                    type="number" 
                    style={obsidianStyles.input}
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
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
              {editProduct ? 'Update Asset' : 'Save Asset'}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default AddProductModal;