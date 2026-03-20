const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. MongoDB Connection with Database name logging
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Compass");
   
  })
  .catch(err => console.error(" Connection Error:", err));

// --- API ROUTES ---

// READ: Get all products
app.get('/api/getAllProducts', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE: Add a new product
app.post('/api/addNewProduct', async (req, res) => {
  try {
    const product = new Product(req.body);
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a product by ID (FIXED VERSION)
app.delete('/api/deleteProduct/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully from DB" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE: Edit a product by ID
app.put('/api/updateProduct/:id', async (req, res) => {
  try {
    const stock = parseInt(req.body.stock);

    let status = 'IN STOCK';
    let color = 'text-success';

    if (stock === 0) {
      status = 'OUT OF STOCK';
      color = 'text-danger';
    } else if (stock < 10) {
      status = 'LOW STOCK';
      color = 'text-warning';
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        stock,
        status,
        color
      },
      { new: true }
    );

    res.json(updatedProduct);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is live on: http://localhost:${PORT}`);
});