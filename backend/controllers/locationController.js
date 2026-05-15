import {
  listAddresses,
  createAddress,
  detectLocation,
  getDeliveryEstimate,
} from '../services/locationService.js'
import asyncHandler from '../utils/asyncHandler.js'

export const getAddresses = asyncHandler(async (_req, res) => {
  res.json(await listAddresses())
})

export const postAddress = asyncHandler(async (req, res) => {
  res.status(201).json(await createAddress(req.body))
})

export const getDetectedLocation = asyncHandler(async (_req, res) => {
  res.json(await detectLocation())
})

export const getEstimate = asyncHandler(async (req, res) => {
  res.json(await getDeliveryEstimate(req.params.addressId))
})
