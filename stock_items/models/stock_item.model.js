const mongoose = require('mongoose');

const StockItemSchema = mongoose.Schema({
  siId: Number,
  name: {
    type: String,
    validate: {
      validator: name => name.length > 2,
      message: 'Name must be longer than 2 characters.',
    },
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    validate: {
      validator: description => description.length > 2,
      message: 'Description must be longer than 2 characters.',
    },
    required: [true, 'Description is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('StockItem', StockItemSchema);
