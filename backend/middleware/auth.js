import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { createHttpError } from '../utils/httpError.js'
import asyncHandler from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password')
      
      if (!req.user) {
        return next(createHttpError(401, 'Not authorized, user not found'))
      }

      next()
    } catch (error) {
      console.error(error)
      return next(createHttpError(401, 'Not authorized, token failed'))
    }
  }

  if (!token) {
    return next(createHttpError(401, 'Not authorized, no token'))
  }
})

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return next(createHttpError(403, 'Not authorized as an admin'))
  }
}
