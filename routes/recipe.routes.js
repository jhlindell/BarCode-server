const recipes = require('../controllers/recipe.controller');
const faker = require('../controllers/faker');

require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });


module.exports = (app) => {
  // Create and save a single Recipe
  app.post('/api/recipes', recipes.create);

  // Retrieve all Recipes
  app.get('/api/recipes', recipes.findAll);

  // Retrieve a single Recipe with rId
  app.get('/api/recipes/:rId', recipes.findOne);

  // Update a Recipe with rId
  app.put('/api/recipes/:rId', recipes.update);

  // Delete a Recipe with rId
  app.delete('/api/recipes/:rId', recipes.delete);

  // // Seed database with a number of recipes
  app.get('/api/seed_recipes/', faker.recipeSeed);

  // empty database of recipes
  app.get('/api/clear_recipes/', faker.recipeClear);
};
