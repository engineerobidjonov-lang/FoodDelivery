const express = require('express');
const router = express.Router();
const { getFoods, createFood } = require('../controllers/foodController');

router.route('/')
  .get(getFoods)
  .post(createFood);

module.exports = router;
