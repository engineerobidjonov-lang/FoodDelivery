import asyncHandler from '../utils/asyncHandler.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import Food from '../models/Food.js'
import Category from '../models/Category.js'
import { createHttpError } from '../utils/httpError.js'

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments()
  const ordersCount = await Order.countDocuments()
  const foodsCount = await Food.countDocuments()
  
  const orders = await Order.find({ status: 'delivered' })
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)

  res.json({
    usersCount,
    ordersCount,
    foodsCount,
    totalRevenue
  })
})

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password')
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    if (user.role === 'admin') {
      throw createHttpError(400, 'Cannot delete admin user')
    }
    await user.deleteOne()
    res.json({ message: 'User removed' })
  } else {
    throw createHttpError(404, 'User not found')
  }
})

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
  res.json(orders)
})

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const order = await Order.findById(req.params.id)

  if (order) {
    order.status = status
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  } else {
    throw createHttpError(404, 'Order not found')
  }
})

// @desc    Create a food
// @route   POST /api/admin/foods
// @access  Private/Admin
export const createFood = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, prepTimeMinutes } = req.body
  const food = new Food({
    name,
    price,
    description,
    imageUrl,
    category,
    prepTimeMinutes
  })

  const createdFood = await food.save()
  res.status(201).json(createdFood)
})

// @desc    Update a food
// @route   PUT /api/admin/foods/:id
// @access  Private/Admin
export const updateFood = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category, prepTimeMinutes, available } = req.body
  const food = await Food.findById(req.params.id)

  if (food) {
    food.name = name || food.name
    food.price = price || food.price
    food.description = description || food.description
    food.imageUrl = imageUrl || food.imageUrl
    food.category = category || food.category
    food.prepTimeMinutes = prepTimeMinutes || food.prepTimeMinutes
    food.available = available !== undefined ? available : food.available

    const updatedFood = await food.save()
    res.json(updatedFood)
  } else {
    throw createHttpError(404, 'Food not found')
  }
})

// @desc    Delete a food
// @route   DELETE /api/admin/foods/:id
// @access  Private/Admin
export const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id)
  if (food) {
    await food.deleteOne()
    res.json({ message: 'Food removed' })
  } else {
    throw createHttpError(404, 'Food not found')
  }
})

// Category Management
export const createCategory = asyncHandler(async (req, res) => {
  const { name, subtitle, banner, deliveryEta } = req.body
  const category = new Category({ name, subtitle, banner, deliveryEta })
  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (category) {
    await category.deleteOne()
    res.json({ message: 'Category removed' })
  } else {
    throw createHttpError(404, 'Category not found')
  }
})
