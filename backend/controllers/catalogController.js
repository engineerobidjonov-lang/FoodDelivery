import {
  listCategories,
  getCategory,
  listFoods,
  getFoodById,
  getSellerContact,
} from '../services/catalogService.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getCategories = asyncHandler(async (_req, res) => {
  res.json(await listCategories())
})

export const getCategoryDetails = asyncHandler(async (req, res) => {
  res.json(await getCategory(req.params.categoryId))
})

export const getFoods = asyncHandler(async (req, res) => {
  res.json(await listFoods(req.query))
})

export const getFoodsByCategory = asyncHandler(async (req, res) => {
  const category = await getCategory(req.params.categoryId)
  const foods = await listFoods({
    ...req.query,
    category: category._id.toString(),
  })

  res.json({
    category,
    items: foods,
  })
})

export const getFood = asyncHandler(async (req, res) => {
  res.json(await getFoodById(req.params.id))
})

export const getContact = asyncHandler(async (req, res) => {
  res.json(await getSellerContact(req.params.id))
})
