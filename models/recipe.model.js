const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-lazarus');

function ingredientCount(val) {
  return val.length >= 1;
}

const Ingredient = mongoose.Schema({
  measure: {
    type: Number,
    required: [true, 'Ingredient measure is required'],
  },
  unit: {
    type: String,
    required: [true, 'Ingredient unit is required'],
  },
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StockItem',
  },
});

const RecipeSchema = mongoose.Schema({
  recipeID: Number,
  name: {
    type: String,
    minlength: [2, 'Name must be longer than 2 characters.'],
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    minlength: [2, 'Description must be longer than 2 characters.'],
    required: [true, 'Description is required'],
  },
  instructions: [String],
  ingredients: {
    type: [Ingredient],
    validate: [ingredientCount, 'Need to have at least one ingredient'],
  },
}, { collation: { locale: 'en_US', strength: 1 }, timestamps: true });

RecipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', RecipeSchema);
