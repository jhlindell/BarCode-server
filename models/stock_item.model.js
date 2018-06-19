const mongoose = require('mongoose');

const StockItemSchema = mongoose.Schema({
  siId: Number,
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('StockItem', StockItemSchema);
