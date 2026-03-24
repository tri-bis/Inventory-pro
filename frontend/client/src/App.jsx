import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { LayoutDashboard, Package, Store, Search, Plus, Bell, Trash2, Edit, MapPin } from 'lucide-react'; 
import AddProductModal from './components/AddProductModal'; 
import DeleteConfirmModal from './components/DeleteConfirmModal';
import axios from 'axios';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]); // NEW: State for warehouses
  const [searchTerm, setSearchTerm] = useState(""); 
  const [editProduct, setEditProduct] = useState(null); 
  const [productToDelete, setProductToDelete] = useState(null);

  const API_URL = 'https://inventory-pro-tgym.onrender.com/api';

  // 1. Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/getAllProducts`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 2. NEW: Fetch warehouses for the Modal dropdown
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
    fetchWarehouses(); // Load warehouses on mount
  }, []);

  // 3. Add or Update Logic
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

  // 4. Delete Logic
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

  // --- 5. DYNAMIC CALCULATIONS ---
  const totalValue = products.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const stock = parseInt(item.stock, 10) || 0;
    return acc + (price * stock);
  }, 0);

  const lowStockCount = products.filter(p => {
    const s = parseInt(p.stock, 10);
    return !isNaN(s) && s > 0 && s < 10;
  }).length;

  // 6. Live Search Filter
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar p-4 d-flex flex-column">
        <div className="d-flex align-items-center gap-2 mb-5">
          <div className="bg-primary p-2 rounded-3"><Package color="white" /></div>
          <span className="fw-bold fs-5 text-white">Inventory Pro</span>
        </div>
        <div className="d-flex flex-column gap-3 flex-grow-1">
          <div className="text-secondary d-flex align-items-center gap-3 p-2 cursor-pointer hover-effect">
            <LayoutDashboard size={20}/> Dashboard
          </div>
          <div className="text-primary d-flex align-items-center gap-3 p-2 bg-primary bg-opacity-10 rounded-3">
            <Package size={20}/> Inventory
          </div>
          <div className="text-secondary d-flex align-items-center gap-3 p-2 cursor-pointer hover-effect">
            <Store size={20}/> Profile
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 overflow-auto vh-100">
        <header className="p-4 d-flex justify-content-between align-items-center border-bottom border-white border-opacity-10">
          <div className="position-relative w-50">
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={18} />
            <Form.Control 
                type="text" 
                placeholder="Search by name, vendor, or warehouse..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark border-0 text-white ps-5 py-2 rounded-3 search-input" 
                style={{backgroundColor: '#1a1438'}} 
            />
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Bell className="text-white cursor-pointer" />
            <Button variant="warning" onClick={() => setShowModal(true)} className="rounded-3 px-4 d-flex align-items-center gap-2">
              <Plus size={18} /> Add Product
            </Button>
          </div>
        </header>

        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="inventory-card p-3 shadow-sm">
                <div className="text-secondary small mb-2">Total Products</div>
                <div className="fs-3 fw-bold text-white">{products.length}</div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="inventory-card p-3 shadow-sm">
                <div className="text-secondary small mb-2">Total Inventory Value</div>
                <div className="fs-3 fw-bold text-white">
                    {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                    }).format(totalValue)}
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="inventory-card p-3 shadow-sm">
                <div className="text-secondary small mb-2">Low Stock Items</div>
                <div className={`fs-3 fw-bold ${lowStockCount > 0 ? 'text-warning' : 'text-white'}`}>
                    {lowStockCount}
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="inventory-card border-0 shadow-sm">
            <div className="p-4 d-flex justify-content-between text-white">
              <h5 className="mb-0">Product Inventory</h5>
              <span className="text-secondary small">{filteredProducts.length} items found</span>
            </div>
            <Table responsive className="text-white table-custom">
              <thead>
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
                    <td>
                      <span className={`badge bg-opacity-10 ${categoryColors[item.cat] || 'bg-secondary text-secondary'}`}>
                        {item.cat}
                      </span>
                    </td>
                    <td className="text-white fw-medium">₹{item.price}</td>
                    <td><div className={item.color}>● {item.status}</div></td>
                    <td className="text-end">
                      <Button variant="link" className="text-info p-0 me-3" onClick={() => { setEditProduct(item); setShowModal(true); }}>
                        <Edit size={18} />
                      </Button>
                      <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteClick(item)}>
                        <Trash2 size={18} />
                      </Button>
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
        warehouses={warehouses} // PASS WAREHOUSES TO MODAL
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