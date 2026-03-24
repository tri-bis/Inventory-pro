const Warehouse = require('../models/Warehouse');

// GET all warehouses (for the dropdown)
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find().sort({ name: 1 });
    res.json(warehouses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a new warehouse
exports.addWarehouse = async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    const newWarehouse = await warehouse.save();
    res.status(201).json(newWarehouse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};