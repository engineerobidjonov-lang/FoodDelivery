import DeliveryPerson from '../models/DeliveryPerson.js'
import Address from '../models/Address.js'
import { createHttpError } from '../utils/httpError.js'

export async function listAddresses() {
  return await Address.find()
}

export async function createAddress(payload = {}) {
  const { label, street, city, region, postalCode } = payload
  if (!street || !city || !region || !postalCode) {
    throw createHttpError(400, 'street, city, region, and postalCode are required.')
  }
  
  const address = await Address.create({
    label: label || 'Saved Address',
    street: String(street).trim(),
    city: String(city).trim(),
    region: String(region).trim(),
    postalCode: String(postalCode).trim()
  })
  
  // Set as default if it's the first one
  const count = await Address.countDocuments()
  if (count === 1) {
    address.isDefault = true
    await address.save()
  }
  
  return address
}

export async function detectLocation() {
  const primaryAddress = await Address.findOne({ isDefault: true }) || await Address.findOne()
  return {
    detected: true,
    address: primaryAddress,
    estimate: primaryAddress ? '20-30 minutes' : '25-35 minutes',
    zone: 'Central delivery zone',
  }
}

export async function getDeliveryEstimate(addressId) {
  const address = await Address.findById(addressId)
  if (!address) {
    throw createHttpError(404, 'Address not found.')
  }

  const deliveryPerson = await DeliveryPerson.findOne({ available: true }) || 
                         await DeliveryPerson.findOne()

  const baseTime = 15
  const randomBuffer = Math.floor(Math.random() * 15)
  const totalTime = baseTime + randomBuffer

  return {
    address,
    deliveryPerson: deliveryPerson ? {
      name: deliveryPerson.name,
      phone: deliveryPerson.phone,
      currentLocation: deliveryPerson.currentLocation,
    } : null,
    estimatedArrivalMinutes: totalTime,
    formattedEstimate: `${totalTime} minutes`,
    distanceKm: (totalTime / 5).toFixed(1),
  }
}
