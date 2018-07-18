const faker = require('faker');
const Recipe = require('../models/recipe.model');
const StockItem = require('../models/stock_item.model');
const User = require('../models/user.model');

// array of users to seed database
const users = [
  {
    username: 'Jon',
    email: 'jon@foo.com',
    password: 'word',
  },
  {
    username: 'Dave',
    email: 'dave@foo.com',
    password: 'pword',
  },
  {
    username: 'Bob',
    email: 'bob@foo.com',
    password: 'password',
  },
  {
    username: 'Steve',
    email: 'steve@foo.com',
    password: 'w3rd',
  },
  {
    username: 'Jeph',
    email: 'jeph@foo.com',
    password: 'w0rd',
  },
  {
    username: 'Sally',
    email: 'sally@foo.com',
    password: 'passw0rd',
  },
  {
    username: 'Betty',
    email: 'betty@foo.com',
    password: 'passw0rd',
  },
];

// Seed recipes to collection
exports.recipeSeed = async () => {
  const recipes = [];
  let rando = 0;
  const stockItems = await StockItem.find();
  const userList = await User.find();
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
    rando = Math.floor(Math.random() * 7);
    const createdBy = userList[rando]._id;
    recipes.push({
      name,
      description,
      instructions,
      ingredients,
      createdBy,
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
  const userList = await User.find();
  let rando;
  for (let i = 0; i < 200; i += 1) {
    rando = Math.floor(Math.random() * 7);
    const createdBy = userList[rando]._id;
    const name = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    items.push({ name, description, createdBy });
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

// Clear all users from database
exports.userClear = async () => {
  try {
    await User.deleteMany({});
    return 'success in deleting users';
  } catch (err) {
    return err.message;
  }
};

// Seed users into database
exports.userSeed = async () => {
  const results = [];
  users.forEach(async (user) => {
    const newUser = new User(user);
    try {
      results.push(newUser.save());
    } catch (err) {
      throw err;
    }
  });
  try {
    const resolvedResults = await Promise.all(results);
    return resolvedResults;
  } catch (err) {
    throw err;
  }
};
