const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Warehouse name is required'],
    unique: true 
  },
  location: { type: String, default: 'Jamshedpur' },
  manager: { type: String, default: 'Trisha' }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);