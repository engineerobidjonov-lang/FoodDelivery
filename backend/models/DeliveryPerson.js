import mongoose from 'mongoose'

const deliveryPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  available: { type: Boolean, default: true }
}, { timestamps: true })

const DeliveryPerson = mongoose.model('DeliveryPerson', deliveryPersonSchema)

export default DeliveryPerson
