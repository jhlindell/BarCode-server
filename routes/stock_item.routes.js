const stockItems = require('../controllers/stock_item.controller');
const faker = require('../controllers/faker');

require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {
  // Create and save a single Stock Item
  app.post('/api/stock_items', requireAuth, async (req, res) => {
    const { name, description } = req.body;
    try {
      const item = stockItems.create(name, description);
      res.send(item);
    } catch (err) {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating item.',
        });
      }
    }
  });

  // Retrieve all Stock Items
  app.get('/api/stock_items', async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const { search } = req.query;
    try {
      const items = await stockItems.findAll(page, limit, search);
      res.send(items);
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving items.',
      });
    }
  });

  // Retrieve a single Stock Item with siId
  app.get('/api/stock_items/:siId', async (req, res) => {
    const id = req.params.siId;
    try {
      const item = await stockItems.findOne(id);
      if (item._id) {
        res.send(item);
      }
    } catch (err) {
      if (err.message === `Item not found with id: ${id}`) {
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    }
  });

  // Update a Stock Item with siId
  app.put('/api/stock_items/:siId', requireAuth, async (req, res) => {
    const { name, description } = req.body;
    const id = req.params.siId;
    try {
      const item = await stockItems.update(name, description, id);
      res.send(item);
    } catch (err) {
      if (err.kind === 'ObjectId' || err.message === `Item not found with id ${id}`) {
        res.status(404).send({
          message: `Item not found with id ${id}`,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  });

  // Delete a Stock Items with siId
  app.delete('/api/stock_items/:siId', requireAuth, async (req, res) => {
    const id = req.params.siId;
    try {
      const item = await stockItems.delete(id);
      if (item._id) {
        res.send(item);
      } else {
        res.status(404).send({
          message: `Item not found with id: ${id}`,
        });
      }
    } catch (err) {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        res.status(404).send({
          message: `Item not found with id: ${id}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete item with id ${id}`,
        });
      }
    }
  });

  // Seed database with a number of stockitems
  app.get('/api/seed_stock_items/', faker.stockItemSeed);

  // empty database of stock items
  app.get('/api/clear_stock_items/', faker.stockItemClear);
};
