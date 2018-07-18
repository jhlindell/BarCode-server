const recipes = require('../controllers/recipe.controller');
const faker = require('../controllers/faker');

require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });


module.exports = (app) => {
  // Create and save a single Recipe
  app.post('/api/recipes', requireAuth, async (req, res) => {
    const {
      name, description, instructions, ingredients,
    } = req.body;
    try {
      const recipe = recipes.create(name, description, instructions, ingredients);
      res.send(recipe);
    } catch (err) {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: err.message || 'Some error occurred while creating recipe.',
        });
      }
    }
  });

  // Retrieve all Recipes
  app.get('/api/recipes', async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const { search } = req.query;
    try {
      const items = await recipes.findAll(page, limit, search);
      res.send(items);
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving items.',
      });
    }
  });

  // Retrieve a single Recipe with rId
  app.get('/api/recipes/:rId', async (req, res) => {
    const id = req.params.rId;
    try {
      const recipe = await recipes.findOne(id);
      if (recipe._id) {
        res.send(recipe);
      }
    } catch (err) {
      if (err.message === `Recipe not found with id: ${id}` || err.kind === 'ObjectId') {
        res.status(404).send(err);
      } else {
        res.status(500).send(err);
      }
    }
  });

  // Update a Recipe with rId
  app.put('/api/recipes/:rId', requireAuth, async (req, res) => {
    const {
      name, description, instructions, ingredients,
    } = req.body;
    const id = req.params.rId;
    try {
      const recipe = await recipes.update(name, description, instructions, ingredients, id);
      res.send(recipe);
    } catch (err) {
      if (err.kind === 'ObjectId' || err.message === `Recipe not found with id ${id}`) {
        res.status(404).send({
          message: `Recipe not found with id ${id}`,
        });
      } else {
        res.status(500).send({
          message: err.message,
        });
      }
    }
  });

  // Delete a Recipe with rId
  app.delete('/api/recipes/:rId', requireAuth, async (req, res) => {
    const id = req.params.rId;
    try {
      const recipe = await recipes.delete(id);
      if (recipe._id) {
        res.send(recipe);
      } else {
        res.status(404).send({
          message: `Recipe not found with id: ${id}`,
        });
      }
    } catch (err) {
      if (err.kind === 'ObjectId' || err.message === `Recipe not found with id ${id}`) {
        res.status(404).send({
          message: `Recipe not found with id: ${id}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete recipe with id ${id}`,
        });
      }
    }
  });

  // // Seed database with a number of recipes
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
};
