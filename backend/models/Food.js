import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  available: { type: Boolean, default: true },
  prepTimeMinutes: { type: Number }
}, { timestamps: true })

const Food = mongoose.model('Food', foodSchema)
export default Food
