import express from 'express'
import {
  getAddresses,
  postAddress,
  getDetectedLocation,
  getEstimate,
} from '../controllers/locationController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/addresses', protect, getAddresses)
router.post('/addresses', protect, postAddress)
router.get('/location/detect', getDetectedLocation)
router.get('/estimate/:addressId', getEstimate)

export default router
