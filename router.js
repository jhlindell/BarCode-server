const stockItemRoutes = require('./routes/stock_item.routes');
const recipeRoutes = require('./routes/recipe.routes');

module.exports = (app) => {
  stockItemRoutes(app);
  recipeRoutes(app);
};
