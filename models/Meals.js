const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    probability: { type: Number, required: true },
});

module.exports = mongoose.model('Meal', mealSchema);
