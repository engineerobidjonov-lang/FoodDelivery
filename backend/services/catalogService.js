import Category from '../models/Category.js'
import Food from '../models/Food.js'
import Seller from '../models/Seller.js'
import { createHttpError } from '../utils/httpError.js'

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const serializeCategory = (category, itemCount = 0) => {
  const catObj = category.toObject ? category.toObject() : category
  const seller = catObj.seller

  return {
    id: catObj._id?.toString(),
    _id: catObj._id,
    name: catObj.name,
    subtitle: catObj.subtitle || '',
    banner: catObj.banner || '',
    deliveryEta: catObj.deliveryEta || '',
    itemCount,
    sellerName: seller?.name || '',
    sellerPhone: seller?.phone || '+998 71 200 10 10',
  }
}

const serializeFood = (food) => {
  const foodObj = food.toObject ? food.toObject() : food
  const category = foodObj.category
  const categoryName = typeof category === 'object' && category !== null
    ? category.name
    : foodObj.categoryName

  return {
    id: foodObj._id?.toString(),
    _id: foodObj._id,
    name: foodObj.name,
    description: foodObj.description || '',
    price: Number(foodObj.price || 0),
    category: categoryName || 'Uncategorized',
    categoryId: typeof category === 'object' && category !== null
      ? category._id?.toString()
      : category?.toString(),
    imageUrl: foodObj.imageUrl || foodObj.image || '',
    image: foodObj.image || foodObj.imageUrl || '',
    available: foodObj.available !== false,
    prepTimeMinutes: foodObj.prepTimeMinutes || null,
  }
}

export async function listCategories() {
  const categories = await Category.find().populate('seller')
  const foods = await Food.find()

  return categories.map(category => serializeCategory(
    category,
    foods.filter((food) => food.category.toString() === category._id.toString()).length
  ))
}

export async function getCategory(identifier) {
  let category
  if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
    category = await Category.findById(identifier).populate('seller')
  } else {
    category = await Category.findOne({ name: new RegExp(`^${escapeRegex(identifier)}$`, 'i') }).populate('seller')
  }

  if (!category) {
    throw createHttpError(404, `Category "${identifier}" was not found.`)
  }

  const itemCount = await Food.countDocuments({ category: category._id })
  return serializeCategory(category, itemCount)
}

export async function listFoods(filters = {}) {
  const { category, search, maxPrice, sort = 'default', limit, availableOnly } = filters

  let query = {}

  if (category) {
    const cat = await getCategory(category)
    query.category = cat._id
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  }

  if (maxPrice) {
    query.price = { $lte: Number(maxPrice) }
  }

  if (availableOnly === 'true' || availableOnly === true) {
    query.available = true
  }

  let result = Food.find(query).populate('category')

  if (sort === 'price_asc') result = result.sort({ price: 1 })
  else if (sort === 'price_desc') result = result.sort({ price: -1 })
  else if (sort === 'name_asc') result = result.sort({ name: 1 })

  if (limit) result = result.limit(Number(limit))

  const foods = await result
  return foods.map(serializeFood)
}

export async function getFoodById(id) {
  const food = await Food.findById(id).populate('category')
  if (!food) {
    throw createHttpError(404, `Food item "${id}" was not found.`)
  }
  return serializeFood(food)
}

export async function getSellerContact(foodId) {
  const food = await Food.findById(foodId).populate({
    path: 'category',
    populate: { path: 'seller' }
  })
  
  if (!food) {
    throw createHttpError(404, `Food item "${foodId}" was not found.`)
  }

  const seller = food.category?.seller
  if (!seller) {
    throw createHttpError(404, 'Seller for this food not found.')
  }

  return {
    foodId: food._id,
    foodName: food.name,
    seller: seller.name,
    phone: seller.phone,
  }
}
