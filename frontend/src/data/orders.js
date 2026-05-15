import { foods } from './mockData'

export async function createOrder(payload) {
  console.log('Mock Order Created:', payload)
  return Promise.resolve({ _id: 'mock_' + Math.random().toString(36).substr(2, 9) })
}

export async function fetchOrderQuote(items) {
  const subtotal = items.reduce((total, item) => {
    const food = foods.find((f) => f.id === item.foodId)
    return total + (food ? food.price * item.quantity : 0)
  }, 0)
  
  const deliveryFee = subtotal > 0 ? 15000 : 0
  const total = subtotal + deliveryFee

  return Promise.resolve({
    subtotal,
    deliveryFee,
    total,
  })
}

export async function fetchSellerContact(foodId) {
  const food = foods.find(f => f.id === foodId)
  return Promise.resolve({
    foodName: food ? food.name : 'Unknown',
    seller: 'Ilyos Fast Food',
    phone: '+998 90 123 45 67'
  })
}
