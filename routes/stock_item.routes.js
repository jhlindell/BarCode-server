const stockItems = require('../controllers/stock_item.controller');
const faker = require('../controllers/faker');

require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });


module.exports = (app) => {
  // Create and save a single Stock Item
  app.post('/api/stock_items', requireAuth, stockItems.create);

  // Retrieve all Stock Items
  app.get('/api/stock_items', stockItems.findAll);

  // Retrieve a single Stock Item with siId
  app.get('/api/stock_items/:siId', stockItems.findOne);

  // Update a Stock Item with siId
  app.put('/api/stock_items/:siId', requireAuth, stockItems.update);

  // Delete a Stock Items with siId
  app.delete('/api/stock_items/:siId', requireAuth, stockItems.delete);

  // Seed database with a number of stockitems
  app.get('/api/seed_stock_items/', faker.stockItemSeed);

  // empty database of stock items
  app.get('/api/clear_stock_items/', faker.stockItemClear);
};
