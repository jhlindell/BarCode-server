const mongoose = require('mongoose');

const StockItemSchema = mongoose.Schema({
    siId: Number,
    name: String,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('StockItem', StockItemSchema);