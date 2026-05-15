import Order from '../models/Order.js'
import User from '../models/User.js'
import Food from '../models/Food.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createHttpError } from '../utils/httpError.js'

/**
 * @desc    Validate and calculate order totals
 * @param   {Array} items - List of items with foodId and quantity
 * @returns {Object} { orderItems, totalPrice }
 */
const prepareOrderData = async (items) => {
  let totalPrice = 0
  const orderItems = []

  for (const item of items) {
    const food = await Food.findById(item.foodId)
    if (!food) {
      throw createHttpError(404, `Food with ID ${item.foodId} not found`)
    }
    
    const price = food.price
    totalPrice += price * item.quantity
    
    orderItems.push({
      foodId: item.foodId,
      quantity: item.quantity,
      price: price
    })
  }

  return { orderItems, totalPrice }
}

// @desc    Create new order
// @route   POST /api/orders/create
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, address } = req.body

  if (!items || items.length === 0) {
    throw createHttpError(400, 'Order must contain at least one item')
  }

  const { orderItems, totalPrice } = await prepareOrderData(items)

  const order = await Order.create({
    userId: req.user._id,
    items: orderItems,
    totalPrice,
    address,
  })

  // Update user: push order to history and clear active cart
  await User.findByIdAndUpdate(req.user._id, {
    $push: { orders: order._id },
    $set: { cart: [] }
  })

  res.status(201).json(order)
})

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('items.foodId', 'name image')
  
  res.json(orders)
})

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.foodId')
    .populate('userId', 'name email')

  if (!order) {
    throw createHttpError(404, 'Order not found')
  }

  // Security check: only the owner or an admin can view the order
  if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw createHttpError(403, 'Not authorized to view this order')
  }

  res.json(order)
})

// @desc    Update order status (Admin/Delivery)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered']

  if (!validStatuses.includes(status)) {
    throw createHttpError(400, 'Invalid status update')
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )

  if (!order) {
    throw createHttpError(404, 'Order not found')
  }

  res.json(order)
})

// For compatibility with previous quote logic
export const postQuote = asyncHandler(async (req, res) => {
  const { items } = req.body
  let subtotal = 0
  for (const item of items) {
    const food = await Food.findById(item.foodId)
    if (food) subtotal += food.price * item.quantity
  }
  const deliveryFee = subtotal > 0 ? 4 : 0
  res.json({
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    currency: 'USD'
  })
})
