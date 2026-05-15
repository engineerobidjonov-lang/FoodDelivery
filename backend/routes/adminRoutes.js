import express from 'express'
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  createFood,
  updateFood,
  deleteFood,
  createCategory,
  deleteCategory
} from '../controllers/adminController.js'
import { protect, admin } from '../middleware/auth.js'

const router = express.Router()

// All routes here are protected and require admin role
router.use(protect)
router.use(admin)

router.get('/stats', getDashboardStats)

router.route('/users')
  .get(getAllUsers)

router.route('/users/:id')
  .delete(deleteUser)

router.route('/orders')
  .get(getAllOrders)

router.route('/orders/:id/status')
  .put(updateOrderStatus)

router.route('/foods')
  .post(createFood)

router.route('/foods/:id')
  .put(updateFood)
  .delete(deleteFood)

router.route('/categories')
  .post(createCategory)

router.route('/categories/:id')
  .delete(deleteCategory)

export default router
