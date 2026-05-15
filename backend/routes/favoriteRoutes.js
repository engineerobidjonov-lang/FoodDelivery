import express from 'express'
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favoriteController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', protect, getFavorites)
router.post('/add', protect, addToFavorites)
router.delete('/remove', protect, removeFromFavorites)

export default router
