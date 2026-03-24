const express = require('express');
const router = express.Router();
const { getWarehouses, addWarehouse } = require('../controllers/warehouseController');

router.get('/all', getWarehouses);
router.post('/add', addWarehouse);

module.exports = router;