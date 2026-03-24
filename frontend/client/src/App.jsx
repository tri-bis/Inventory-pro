import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { LayoutDashboard, Package, Store, Search, Plus, Bell, Trash2, Edit, MapPin, PlusCircle } from 'lucide-react'; 
import AddProductModal from './components/AddProductModal'; 
import AddWarehouseModal from './components/AddWarehouseModal'; 
import DeleteConfirmModal from './components/DeleteConfirmModal';
import axios from 'axios';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [editProduct, setEditProduct] = useState(null); 
  const [productToDelete, setProductToDelete] = useState(null);

  const API_URL = 'https://inventory-pro-tgym.onrender.com/api';

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/getAllProducts`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get(`${API_URL}/warehouses/all`);
      setWarehouses(res.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  const handleSaveProduct = async (productData) => {
    try {
      if (editProduct) {
        await axios.put(`${API_URL}/updateProduct/${editProduct._id}`, productData);
      } else {
        await axios.post(`${API_URL}/addNewProduct`, productData);
      }
      fetchProducts(); 
      handleCloseModal();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleSaveWarehouse = async (warehouseData) => {
    try {
      await axios.post(`${API_URL}/warehouses/add`, warehouseData);
      fetchWarehouses(); 
      setShowWarehouseModal(false);
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`${API_URL}/deleteProduct/${productToDelete._id}`);
        setProducts(prev => prev.filter(item => item._id !== productToDelete._id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditProduct(null); 
  };

  // FIX: Strips symbols like ₹ and commas so the math works
  const totalValue = products.reduce((acc, item) => {
    const rawPrice = item.price || "0";
    const cleanPrice = String(rawPrice).replace(/[^\d.]/g, ''); 
    const price = parseFloat(cleanPrice) || 0;
    const stock = parseInt(item.stock, 10) || 0;
    return acc + (price * stock);
  }, 0);

  const lowStockCount = products.filter(p => {
    const s = parseInt(p.stock, 10);
    return !isNaN(s) && s > 0 && s < 10;
  }).length;

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.warehouse?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryColors = {
    'Laptops': 'bg-info text-info',
    'Server Components': 'bg-light text-purple', 
    'Networking Gear': 'bg-primary text-primary',
    'Peripheral Devices': 'bg-warning text-warning',
    'Mobile Technology': 'bg-success text-success'
  };

  return (
    <div className="d-flex text-white" style={{ minHeight: '100vh', backgroundColor: '#0f0a1e'}}>
      {/* Sidebar */}
      <div className="sidebar p-4 d-flex flex-column border-end border-white border-opacity-10" style={{ width: '250px', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2 mb-5">
          <div className="bg-primary p-2 rounded-3"><Package color="white" /></div>
          <span className="fw-bold fs-5">Inventory Pro</span>
        </div>
        <div className="d-flex flex-column gap-3 flex-grow-1">
          <div className="text-secondary d-flex align-items-center gap-3 p-2 cursor-pointer">
            <LayoutDashboard size={20}/> Dashboard
          </div>
          <div className="text-primary d-flex align-items-center gap-3 p-2 bg-primary bg-opacity-10 rounded-3">
            <Package size={20}/> Inventory
          </div>
          <div className="text-secondary d-flex align-items-center gap-3 p-2 cursor-pointer">
            <Store size={20}/> Profile
          </div>
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column vh-100" style={{ minWidth: 0 }}>
  
        <header 
  className="p-3 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-10 sticky-top" 
  style={{ 
    zIndex: 1020, 
    backgroundColor: '#0f0a1e' // Matches your main background
  }}
>
  <div className="position-relative" style={{ width: '40%' }}>
    <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={18} />
    <Form.Control 
        type="text" 
        placeholder="Search products..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-0 text-white ps-5 py-2 rounded-3" 
        style={{
          backgroundColor: '#222634', // Greyish-blue shade to make it visible
          outline: 'none', 
          boxShadow: 'none',
          color: '#ffffff'
        }} 
    />
  </div>
  
  <div className="d-flex gap-2 align-items-center flex-nowrap" style={{ minWidth: 'max-content' }}>
    <Bell className="text-white cursor-pointer me-2" size={20} />
    
    <Button 
      variant="outline-info" 
      onClick={() => setShowWarehouseModal(true)} 
      className="rounded-3 px-3 d-flex align-items-center gap-2 border-info text-nowrap"
    >
      <PlusCircle size={18} /> Warehouse
    </Button>

    <Button 
      variant="warning" 
      onClick={() => setShowModal(true)} 
      className="rounded-3 px-4 d-flex align-items-center gap-2 fw-bold text-nowrap"
    >
      <Plus size={18} /> Add Product
    </Button>
  </div>
</header>

        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
                <Card className="inventory-card p-3 shadow-sm text-center">
                    <div className="text-secondary small mb-1">Total Products</div>
                    <div className="fs-3 fw-bold">{products.length}</div>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="inventory-card p-3 shadow-sm text-center">
                    <div className="text-secondary small mb-1">Total Inventory Value</div>
                    <div className="fs-3 fw-bold text-white">
                        ₹{totalValue.toLocaleString('en-IN')}
                    </div>
                </Card>
            </Col>
            <Col md={4}>
                <Card className="inventory-card p-3 shadow-sm text-center">
                    <div className="text-secondary small mb-1">Low Stock Items</div>
                    <div className={`fs-3 fw-bold ${lowStockCount > 0 ? 'text-warning' : 'text-white'}`}>{lowStockCount}</div>
                </Card>
            </Col>
          </Row>

          <Card className="inventory-card border-0 shadow-sm overflow-hidden">
            <Table responsive className="text-white table-custom mb-0">
              <thead className="bg-primary bg-opacity-10">
                <tr>
                  <th>Product Name</th>
                  <th>Warehouse</th> 
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr key={item._id} className="align-middle custom-table-row">
                    <td className="fw-bold text-white">{item.name}</td>
                    <td className="text-info">
                      <div className="d-flex align-items-center gap-1">
                        <MapPin size={14} /> {item.warehouse?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td className="text-secondary">{item.vendor}</td>
                    <td><span className={`badge bg-opacity-10 ${categoryColors[item.cat] || 'bg-secondary text-secondary'}`}>{item.cat}</span></td>
                    <td className="fw-medium text-white">₹{String(item.price).replace('₹', '')}</td>
                    <td><div className={item.color}>● {item.status}</div></td>
                    <td className="text-end">
                      <Button variant="link" className="text-info p-0 me-3" onClick={() => { setEditProduct(item); setShowModal(true); }}><Edit size={18} /></Button>
                      <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteClick(item)}><Trash2 size={18} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Container>
      </div>

      <AddProductModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        onAdd={handleSaveProduct} 
        editProduct={editProduct}
        warehouses={warehouses}
      />

      <AddWarehouseModal 
        show={showWarehouseModal}
        handleClose={() => setShowWarehouseModal(false)}
        onAdd={handleSaveWarehouse}
      />

      <DeleteConfirmModal 
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
    </div>
  );
}

export default App;