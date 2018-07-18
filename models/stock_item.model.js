const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-lazarus');

const { Schema } = mongoose;

const StockItemSchema = Schema({
  stockId: Schema.Types.ObjectId,
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
}, { collation: { locale: 'en_US', strength: 1 }, timestamps: true });

StockItemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('StockItem', StockItemSchema);
