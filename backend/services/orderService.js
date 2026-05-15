import Order from '../models/Order.js'
import Food from '../models/Food.js'
import DeliveryPerson from '../models/DeliveryPerson.js'
import { createHttpError } from '../utils/httpError.js'

export async function buildQuote(payload = {}) {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw createHttpError(400, 'Order items are required.')
  }

  const normalizedItems = []
  let subtotal = 0

  for (const item of payload.items) {
    const food = await Food.findById(item.foodId)
    if (!food) throw createHttpError(404, `Food item ${item.foodId} not found`)
    
    const quantity = Number(item.quantity) || 1
    const lineTotal = Number((food.price * quantity).toFixed(2))
    
    normalizedItems.push({
      food: food._id,
      name: food.name,
      price: food.price,
      quantity,
      lineTotal
    })
    subtotal += lineTotal
  }

  const deliveryFee = subtotal > 0 ? 4 : 0
  const total = Number((subtotal + deliveryFee).toFixed(2))

  return {
    items: normalizedItems,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    total,
    currency: 'USD',
  }
}

export async function createOrder(payload = {}) {
  const { userId, address, contactPhone } = payload

  if (!userId) throw createHttpError(400, 'userId is required.')
  if (!address?.street) throw createHttpError(400, 'Address is required.')

  const quote = await buildQuote(payload)
  const deliveryPerson = await DeliveryPerson.findOne({ available: true })

  const order = await Order.create({
    userId,
    contactPhone,
    address,
    items: quote.items.map(item => ({
      foodId: item.food,
      quantity: item.quantity,
      price: item.price
    })),
    totalPrice: quote.total,
    deliveryPerson: deliveryPerson?._id,
    status: 'pending'
  })

  return order
}

export async function listOrders() {
  return await Order.find().sort({ createdAt: -1 }).populate('items.food')
}

export async function getOrderById(id) {
  const order = await Order.findById(id).populate('items.food').populate('deliveryPerson')
  if (!order) {
    throw createHttpError(404, `Order "${id}" was not found.`)
  }
  return order
}
