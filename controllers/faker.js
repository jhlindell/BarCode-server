const faker = require('faker');
const Recipe = require('../models/recipe.model');
const StockItem = require('../models/stock_item.model');

// Seed recipes to collection
exports.recipeSeed = async () => {
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
    rando = (Math.random() * 3) + 1;
    for (let k = 0; k < rando; k += 1) {
      const ingredient = stockItems[Math.floor(Math.random() * stockItems.length)];
      ingredients.push({
        measure: (Math.random() * 3).toFixed(2),
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
  try {
    const result = await Recipe.insertMany(recipes);
    return result;
  } catch (err) {
    throw err;
  }
};

// Clear all recipes from database
exports.recipeClear = async () => {
  try {
    await Recipe.deleteMany({});
    return 'success in deleting recipes';
  } catch (err) {
    return err.message;
  }
};

// Seed items to stock item collection
exports.stockItemSeed = async () => {
  const items = [];
  for (let i = 0; i < 200; i += 1) {
    const name = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    items.push({ name, description });
  }
  try {
    const result = await StockItem.insertMany(items);
    return result;
  } catch (err) {
    throw err;
  }
};

// Clear all stockitems from database
exports.stockItemClear = async () => {
  try {
    await StockItem.deleteMany({});
    return 'success in deleting stock items';
  } catch (err) {
    return err.message;
  }
};

