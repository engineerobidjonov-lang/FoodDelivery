import mongoose from 'mongoose'

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String }
}, { timestamps: true })

const Seller = mongoose.model('Seller', sellerSchema)

export default Seller
