const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      food: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Food'
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'cooking', 'delivering', 'delivered']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
