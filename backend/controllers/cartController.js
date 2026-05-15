import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createHttpError } from '../utils/httpError.js'

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.foodId')
  if (!user) {
    throw createHttpError(404, 'User not found')
  }
  res.json(user.cart)
})

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = asyncHandler(async (req, res) => {
  const { foodId, quantity } = req.body

  if (!foodId) {
    throw createHttpError(400, 'Food ID is required')
  }

  const user = await User.findById(req.user._id)

  const cartItem = user.cart.find((item) => item.foodId.toString() === foodId)

  if (cartItem) {
    cartItem.quantity += (Number(quantity) || 1)
  } else {
    user.cart.push({ foodId, quantity: Number(quantity) || 1 })
  }

  await user.save()
  res.json(user.cart)
})

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { foodId, quantity } = req.body

  if (!foodId || quantity === undefined) {
    throw createHttpError(400, 'Food ID and quantity are required')
  }

  const user = await User.findById(req.user._id)

  const cartItem = user.cart.find((item) => item.foodId.toString() === foodId)

  if (cartItem) {
    if (quantity <= 0) {
      user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId)
    } else {
      cartItem.quantity = quantity
    }
    await user.save()
    res.json(user.cart)
  } else {
    throw createHttpError(404, 'Item not found in cart')
  }
})

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove
// @access  Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const { foodId } = req.body

  if (!foodId) {
    throw createHttpError(400, 'Food ID is required')
  }

  const user = await User.findById(req.user._id)

  user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId)

  await user.save()
  res.json(user.cart)
})
