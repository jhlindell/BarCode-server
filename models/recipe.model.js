const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-lazarus');

const { Schema } = mongoose;

function ingredientCount(val) {
  return val.length >= 1;
}

const Ingredient = Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'StockItem',
  },
});

const RecipeSchema = Schema({
  recipeID: Schema.Types.ObjectId,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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
