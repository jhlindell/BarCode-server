const faker = require('../controllers/faker.controller');

module.exports = (app) => {
// Seed database with a number of recipes
  app.get('/api/seed_recipes/', async (req, res) => {
    try {
      const list = await faker.recipeSeed();
      res.send(list);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // empty database of recipes
  app.get('/api/clear_recipes/', async (req, res) => {
    const message = await faker.recipeClear();
    res.send({ message });
  });

  // Seed database with a number of stockitems
  app.get('/api/seed_stock_items/', async (req, res) => {
    try {
      const items = await faker.stockItemSeed();
      res.send(items);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // empty database of stock items
  app.get('/api/clear_stock_items/', async (req, res) => {
    const message = await faker.stockItemClear();
    res.send({ message });
  });

  // seed database with users
  app.get('/api/seed_users/', async (req, res) => {
    try {
      const users = await faker.userSeed();
      res.send(users);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  // empty database of users
  app.get('/api/clear_users', async (req, res) => {
    const message = await faker.userClear();
    res.send({ message });
  });
};
