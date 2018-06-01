module.exports = (app) => {
    const stock_items = require('../controllers/stock_item.controller.js');

    app.post('/api/stock_items', stock_items.create);

    // Retrieve all Stock Items
    app.get('/api/stock_items', stock_items.findAll);

    // Retrieve a single Stock Item with siId
    app.get('/api/stock_items/:siId', stock_items.findOne);

    // Update a Stock Item with siId
    app.put('/api/stock_items/:siId', stock_items.update);

    // Delete a Stock Items with siId
    app.delete('/api/stock_items/:siId', stock_items.delete);
}