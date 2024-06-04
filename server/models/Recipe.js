
const mongoose = require('mongoose');

const { Schema } = mongoose;

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: String,
  image: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
