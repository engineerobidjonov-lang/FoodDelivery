import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered'], default: 'pending' },
  address: {
    street: String,
    city: String,
    region: String,
    postalCode: String
  }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order
