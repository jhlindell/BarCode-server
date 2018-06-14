const stockItemRoutes = require('./stock_items/routes/stock_item.routes');

module.exports = (app) => {
  stockItemRoutes(app);
};
