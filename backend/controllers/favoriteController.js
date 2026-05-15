import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createHttpError } from '../utils/httpError.js'

// @desc    Get user favorites
// @route   GET /api/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites')
  res.json(user.favorites)
})

// @desc    Add item to favorites
// @route   POST /api/favorites/add
// @access  Private
export const addToFavorites = asyncHandler(async (req, res) => {
  const { foodId } = req.body

  if (!foodId) {
    throw createHttpError(400, 'Food ID is required')
  }

  const user = await User.findById(req.user._id)

  if (!user.favorites.includes(foodId)) {
    user.favorites.push(foodId)
    await user.save()
  }

  res.json(user.favorites)
})

// @desc    Remove item from favorites
// @route   DELETE /api/favorites/remove
// @access  Private
export const removeFromFavorites = asyncHandler(async (req, res) => {
  const { foodId } = req.body

  if (!foodId) {
    throw createHttpError(400, 'Food ID is required')
  }

  const user = await User.findById(req.user._id)

  user.favorites = user.favorites.filter((id) => id.toString() !== foodId)

  await user.save()
  res.json(user.favorites)
})
