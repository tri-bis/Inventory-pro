import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddProductModal = ({ show, handleClose, onAdd, editProduct, warehouses }) => {
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    sku: '',
    cat: 'Laptops',
    price: '',
    stock: '',
    warehouse: '', // NEW: To store the selected Warehouse ID
    status: 'IN STOCK',
    color: 'text-success'
  });

  const categories = ['Laptops', 'Networking Gear', 'Peripheral Devices', 'Mobile Technology', 'Server Components'];

  useEffect(() => {
    if (editProduct) {
      const numericPrice = editProduct.price?.toString().replace(/[^0-9.]/g, '');
      setFormData({ 
        ...editProduct, 
        price: numericPrice,
        // If editing, extract just the ID from the populated warehouse object
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
    
    // Validation: Ensure a warehouse is selected
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
      // Ensure price is stored as a string with the currency symbol
      price: formData.price.toString().startsWith('₹') ? formData.price : `₹${formData.price}`
    };
    
    onAdd(finalData);
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

          <Form.Group className="mb-3">
            <Form.Label className="text-secondary small">Assign Warehouse</Form.Label>
            <Form.Select 
              className="bg-dark border-secondary text-white"
              value={formData.warehouse}
              onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
              required
            >
              <option value="">-- Choose a Warehouse --</option>
              {warehouses && warehouses.map(w => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.location})
                </option>
              ))}
            </Form.Select>
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
                  required
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
              required
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">Price (INR)</Form.Label>
                <Form.Control 
                  type="text" 
                  className="bg-dark border-secondary text-white" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label className="text-secondary small">Stock Quantity</Form.Label>
                <Form.Control 
                  type="number" 
                  className="bg-dark border-secondary text-white" 
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
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