import express from 'express'
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/profile', protect, getUserProfile)
router.put('/update', protect, updateUserProfile)

export default router
