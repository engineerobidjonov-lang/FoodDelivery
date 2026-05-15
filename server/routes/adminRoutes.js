const express = require('express');
const router = express.Router();
const { getStats, getAllOrders, updateOrderStatus, updateFood, deleteFood } = require('../controllers/adminController');
const { createFood } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Dashboard stats
router.get('/stats', protect, admin, getStats);

// Orders
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

// Foods
router.post('/foods', protect, admin, createFood);
router.put('/foods/:id', protect, admin, updateFood);
router.delete('/foods/:id', protect, admin, deleteFood);

module.exports = router;
