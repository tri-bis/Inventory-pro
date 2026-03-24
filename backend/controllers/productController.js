const Product = require('../models/Product');

// READ: Get all products with Warehouse details
exports.getAllProducts = async (req, res) => {
  try {
    
    const products = await Product.find()
      .populate('warehouse', 'name location manager') 
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE: Add a new product linked to a Warehouse
exports.addNewProduct = async (req, res) => {
  try {
    const stock = parseInt(req.body.stock) || 0;
    
    let status = 'IN STOCK';
    let color = 'text-success';

    if (stock === 0) {
      status = 'OUT OF STOCK';
      color = 'text-danger';
    } else if (stock < 10) {
      status = 'LOW STOCK';
      color = 'text-warning';
    }

    
    const product = new Product({
      ...req.body,
      stock,
      status,
      color
    });

    const newProduct = await product.save();
   
    const populatedProduct = await Product.findById(newProduct._id).populate('warehouse', 'name');
    
    res.status(201).json(populatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE: Edit a product by ID
exports.updateProduct = async (req, res) => {
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
      { ...req.body, stock, status, color },
      { new: true }
    ).populate('warehouse', 'name'); 
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE: Remove a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully from DB" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};