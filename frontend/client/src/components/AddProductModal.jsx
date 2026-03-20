import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddProductModal = ({ show, handleClose, onAdd, editProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    sku: '',
    cat: '',
    price: '',
    stock: '',
    status: 'IN STOCK',
    color: 'text-success'
  });

  // Pre-defined categories
  const categories = ['Laptops', 'Networking Gear', 'Peripheral Devices', 'Mobile Technology', 'Server Components'];

  useEffect(() => {
    if (editProduct) {
      const numericPrice = editProduct.price?.toString().replace(/[^0-9.]/g, '');
      setFormData({ ...editProduct, price: numericPrice });
    } else {
      setFormData({
        name: '',
        vendor: '',
        sku: '',
        cat: '',
        price: '',
        stock: '',
        status: 'IN STOCK',
        color: 'text-success'
      });
    }
  }, [editProduct, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockNum = parseInt(formData.stock) || 0;
    
    const finalData = {
      ...formData,
      stock: stockNum,
      status: stockNum === 0 ? 'OUT OF STOCK' : stockNum < 10 ? 'LOW STOCK' : 'IN STOCK',
      color: stockNum === 0 ? 'text-danger' : stockNum < 10 ? 'text-warning' : 'text-success',
      price: formData.price.toString().startsWith('₹') ? formData.price : `₹${formData.price}`
    };
    
    onAdd(finalData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="inventory-card border-secondary text-white">
      <Modal.Header closeButton closeVariant="white" className="border-bottom border-white border-opacity-10">
        <Modal.Title>{editProduct ? 'Edit Product' : 'Add New Product'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small">Product Name</Form.Label>
            <Form.Control 
              className="bg-dark border-secondary text-white" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">Category</Form.Label>
                <Form.Select 
                  className="bg-dark border-secondary text-white"
                  value={formData.cat}
                  onChange={(e) => setFormData({...formData, cat: e.target.value})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">SKU</Form.Label>
                <Form.Control 
                  className="bg-dark border-secondary text-white" 
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small">Vendor</Form.Label>
            <Form.Control 
              className="bg-dark border-secondary text-white" 
              value={formData.vendor}
              onChange={(e) => setFormData({...formData, vendor: e.target.value})}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">Price (INR)</Form.Label>
                <Form.Control 
                  type="text" 
                  step="0.01"
                  className="bg-dark border-secondary text-white" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">Stock Quantity</Form.Label>
                <Form.Control 
                  type="text" 
                  className="bg-dark border-secondary text-white" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="border-top border-white border-opacity-10">
          <Button variant="danger" onClick={handleClose}>Cancel</Button>
          <Button variant="warning" type="submit" className="btn-neon-yellow border-0">
            {editProduct ? 'Update Product' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProductModal;