const stockItemRoutes = require('./routes/stock_item.routes');
const recipeRoutes = require('./routes/recipe.routes');
const authRoutes = require('./routes/auth.routes');
const fakerRoutes = require('./routes/faker.routes');

module.exports = (app) => {
  stockItemRoutes(app);
  recipeRoutes(app);
  authRoutes(app);
  fakerRoutes(app);
};
