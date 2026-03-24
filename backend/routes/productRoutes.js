const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// All routes are now organized here
router.get('/getAllProducts', getAllProducts);
router.post('/addNewProduct', addNewProduct);
router.put('/updateProduct/:id', updateProduct);
router.delete('/deleteProduct/:id', deleteProduct);

module.exports = router;