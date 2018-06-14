const stockItems = require('../controllers/mongoose.controller.js');

module.exports = (app) => {
  app.post('/api/stock_items', stockItems.create);

  // Retrieve all Stock Items
  app.get('/api/stock_items', stockItems.findAll);

  // Retrieve a single Stock Item with siId
  app.get('/api/stock_items/:siId', stockItems.findOne);

  // Update a Stock Item with siId
  app.put('/api/stock_items/:siId', stockItems.update);

  // Delete a Stock Items with siId
  app.delete('/api/stock_items/:siId', stockItems.delete);
};
