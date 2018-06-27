const faker = require('faker');
const Recipe = require('../models/recipe.model');
const StockItem = require('../models/stock_item.model');

// Seed recipes to collection
exports.recipeSeed = async (req, res) => {
  const recipes = [];
  let rando = 0;
  const stockItems = await StockItem.find();
  for (let i = 0; i < 200; i += 1) {
    const name = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    // make instructions
    const instructions = [];
    rando = Math.random() * 5;
    for (let j = 0; j < rando; j += 1) {
      instructions.push(faker.lorem.sentence());
    }
    // make ingredients
    const ingredients = [];
    rando = Math.random() * 4;
    for (let k = 0; k < rando; k += 1) {
      const ingredient = stockItems[Math.floor(Math.random() * stockItems.length)];
      ingredients.push({
        measure: Math.random() * 3,
        unit: 'oz',
        name: ingredient.name,
        _id: ingredient._id,
      });
    }
    recipes.push({
      name,
      description,
      instructions,
      ingredients,
    });
  }
  Recipe.insertMany(recipes)
    .then(response => res.send(response))
    .catch(error => res.send(error));
};

// Clear all recipes from database
exports.recipeClear = (req, res) => {
  Recipe.deleteMany({})
    .then(() => res.send({ message: 'success in deleting recipes' }))
    .catch((error) => {
      res.send(error);
    });
};

// Seed items to stock item collection
exports.stockItemSeed = (req, res) => {
  const items = [];
  for (let i = 0; i < 200; i += 1) {
    const name = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    items.push({ name, description });
  }
  StockItem.insertMany(items)
    .then(response => res.send(response))
    .catch(error => res.send(error));
};

// Clear all stockitems from database
exports.stockItemClear = (req, res) => {
  StockItem.deleteMany({})
    .then(() => res.send({ message: 'success in deleting stock items' }))
    .catch((error) => {
      res.send(error);
    });
};

