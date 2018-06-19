const stockItemRoutes = require('./routes/stock_item.routes');

module.exports = (app) => {
  stockItemRoutes(app);
};
