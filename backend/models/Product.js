const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vendor: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  cat: { type: String, default: 'Laptops' },
  price: { type: String, required: true },
  stock: { type: Number, default: 0 },
  status: { type: String, default: 'IN STOCK' },
  color: { type: String, default: 'text-success' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);