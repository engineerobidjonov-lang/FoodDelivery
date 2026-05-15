import User from '../models/User.js'
import asyncHandler from '../utils/asyncHandler.js'
import { createHttpError } from '../utils/httpError.js'

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('orders')

  if (user) {
    res.json(user)
  } else {
    throw createHttpError(404, 'User not found')
  }
})

// @desc    Update user profile
// @route   PUT /api/user/update
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    
    if (req.body.password) {
      user.password = req.body.password
    }

    if (req.body.addresses) {
      user.addresses = req.body.addresses
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      addresses: updatedUser.addresses,
    })
  } else {
    throw createHttpError(404, 'User not found')
  }
})
