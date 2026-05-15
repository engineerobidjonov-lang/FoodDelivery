import express from 'express'
import {
  createOrder,
  getOrders,
  getOrder,
  postQuote,
} from '../controllers/orderController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/create', protect, createOrder)
router.get('/', protect, getOrders)
router.get('/:id', protect, getOrder)
router.post('/quote', postQuote) // Public quote generation

export default router
