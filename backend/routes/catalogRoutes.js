import express from 'express'
import {
  getCategories,
  getCategoryDetails,
  getFoods,
  getFoodsByCategory,
  getFood,
  getContact,
} from '../controllers/catalogController.js'

const router = express.Router()

router.get('/categories', getCategories)
router.get('/categories/:categoryId', getCategoryDetails)
router.get('/categories/:categoryId/foods', getFoodsByCategory)
router.get('/foods', getFoods)
router.get('/foods/:id', getFood)
router.get('/foods/:id/contact', getContact)

export default router
