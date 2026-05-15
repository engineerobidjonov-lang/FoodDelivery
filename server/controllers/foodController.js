const Food = require('../models/Food');

// @desc    Get all foods
// @route   GET /api/foods
// @access  Public
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a food
// @route   POST /api/foods
// @access  Public (for now)
const createFood = async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body;

    const food = await Food.create({
      name,
      price,
      image,
      description,
      category
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getFoods,
  createFood
};
