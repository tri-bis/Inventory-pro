import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { LayoutDashboard, Package, Store, Search, Plus, Bell, Trash2, Edit } from 'lucide-react'; 
import AddProductModal from './components/AddProductModal'; 
import DeleteConfirmModal from './components/DeleteConfirmModal'; // New Import
import axios from 'axios';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [editProduct, setEditProduct] = useState(null); 
  const [productToDelete, setProductToDelete] = useState(null); // Track item to delete

  // 1. Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://inventory-pro-tgym.onrender.com/api/getAllProducts');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
  fetchProducts();

  const interval = setInterval(() => {
    fetchProducts();
  }, 3000); // every 3 sec

  return () => clearInterval(interval);
}, []);

  // 2. Add or Update Logic
  const handleSaveProduct = async (productData) => {
    try {
      if (editProduct) {
        const res = await axios.put(`https://inventory-pro-tgym.onrender.com/api/updateProduct/${editProduct._id}`, productData);
        setProducts(products.map(p => p._id === editProduct._id ? {...res.data} : p));
      } else {
        const res = await axios.post('https://inventory-pro-tgym.onrender.com/api/addNewProduct', productData);
        setProducts([res.data, ...products]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  // 3. Delete Logic (New Handlers)
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await axios.delete(`https://inventory-pro-tgym.onrender.com/api/deleteProduct/${productToDelete._id}`);
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

  // --- 4. DYNAMIC CALCULATIONS ---
  const totalValue = products.reduce((acc, item) => {
    const rawPrice = item.price || item.Price || "0";
    const cleanPrice = String(rawPrice).replace(/[^0-9.]/g, '');
    const price = parseFloat(cleanPrice) || 0;
    const rawStock = item.stock || item.Stock || 0;
    const stock = parseInt(rawStock, 10) || 0;
    return acc + (price * stock);
  }, 0);

  const lowStockCount = products.filter(p => {
    const s = parseInt(p.stock || p.Stock, 10);
    return !isNaN(s) && s > 0 && s < 10;
  }).length;

  // 5. Live Search Filter
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );
  {/* Define the mapping before the return or inside the map*/}
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
            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" placeholder="Search by name or vendor..." size={18} />
            <Form.Control 
                type="text" 
                placeholder="Search by name or vendor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark border-0 text-white ps-5 py-2 rounded-3 search-input" 
                style={{backgroundColor: '#1a1438', border: 'none'}} 
            />
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Bell className="text- cursor-pointer" />
            <Button variant="warning" onClick={() => setShowModal(true)} className="rounded-3 px-4 d-flex align-items-center gap-2">
              <Plus size={18} /> Add Product
            </Button>
          </div>
        </header>

        <Container fluid className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="inventory-card p-3">
                <div className="text-secondary small mb-2">Total Products</div>
                <div className="fs-3 fw-bold text-white">{products.length}</div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="inventory-card p-3">
                <div className="text-secondary small mb-2">Total Inventory Value</div>
                <div className="fs-3 fw-bold text-white">
                    {new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0, // Set to 2 if you want paisa
      }).format(totalValue)}
                </div>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="inventory-card p-3">
                <div className="text-secondary small mb-2">Low Stock Items</div>
                <div className={`fs-3 fw-bold ${lowStockCount > 0 ? 'text-warning' : 'text-white'}`}>
                    {lowStockCount}
                </div>
              </Card>
            </Col>
          </Row>

          <Card className="inventory-card border-0">
            <div className="p-4 d-flex justify-content-between text-white">
              <h5 className="mb-0">Product Inventory</h5>
              <span className="text-secondary small">{filteredProducts.length} items found</span>
            </div>
            <Table responsive className="text-white table-custom">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Vendor</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => (
                  <tr 
                    key={item._id} 
                    className={`align-middle custom-table-row ${item.status === 'LOW STOCK' ? 'low-stock-row' : ''}`}
                  >
                    <td className="fw-bold text-white">{item.name}</td>
                    <td className="text-secondary">{item.vendor}</td>
                    <td className="text-secondary">{item.sku}</td>
                    <td><span className={`badge bg-opacity-10 ${categoryColors[item.cat] || 'bg-secondary text-secondary'}`}>
    {item.cat}
  </span></td>
                    <td className="text-white fw-medium">{item.price}</td>
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