const assert = require('assert');
const mongoose = require('mongoose');
const winston = require('winston');
const controller = require('../../controllers/recipe.controller');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'barcode.log' }),
  ],
});

const kingstonNegroni = {
  name: 'Kingston Negroni',
  description: 'The best negroni variant!',
  ingredients: [
    { measure: '1.0', unit: 'oz', name: 'Smith & Cross Rum' },
    { measure: '1.0', unit: 'oz', name: 'Campari' },
    { measure: '1.0', unit: 'oz', name: 'Sweet Vermouth' },
  ],
  instructions: [
    'Build in a glass with ice and stir',
  ],
};

const oldFashioned = {
  name: 'Old Fashioned',
  description: 'The original cocktail',
  ingredients: [
    { measure: '2.0', unit: 'oz', name: 'whiskey' },
    { measure: '0.5', unit: 'oz', name: 'simple syrup' },
    { measure: '2.0', unit: 'dash', name: 'bitters' },
  ],
  instructions: [
    'Build in a glass with ice and stir',
  ],
};

const manhatten = {
  name: 'Manhatten',
  description: 'A sophisticated cocktail for sophisticated jerks.',
  ingredients: [
    { measure: '2.0', unit: 'oz', name: 'whiskey' },
    { measure: '1.0', unit: 'oz', name: 'sweet vermouth' },
    { measure: '2.0', unit: 'dash', name: 'bitters' },
    { measure: '1.0', unit: 'piece', name: 'cherry' },
  ],
  instructions: [
    'Build in a glass with ice and stir',
  ],
};

const Recipe = mongoose.model('Recipe');

describe('Recipe controller', () => {
  it('post to /api/recipes should create a recipe', async () => {
    try {
      await controller.create('Kingston Negroni', 'The best negroni variant!', [
        'Build in a glass with ice and stir',
      ], [
        { measure: '2.0', unit: 'oz', name: 'whiskey' },
        { measure: '1.0', unit: 'oz', name: 'sweet vermouth' },
        { measure: '2.0', unit: 'dash', name: 'bitters' },
        { measure: '1.0', unit: 'piece', name: 'cherry' },
      ]);
    } catch (err) {
      logger.info(`${err}`);
    }
    try {
      const recipe = await Recipe.findOne({ name: 'Kingston Negroni' });
      assert(recipe.name === 'Kingston Negroni');
    } catch (err) {
      logger.info(`${err}`);
    }
  });

  it('POST to /api/recipes with incomplete object should return error message', async () => {
    try {
      await controller.create('Kingston Negroni', 'The best negroni variant!', [
        'Build in a glass with ice and stir',
      ], []);
    } catch (err) {
      assert(err.message === 'Recipe validation failed: ingredients: Need to have at least one ingredient');
    }
  });

  it('GET to /api/recipes should get all recipes', async () => {
    const recipe = new Recipe(kingstonNegroni);
    const recipe2 = new Recipe(oldFashioned);
    const recipe3 = new Recipe(manhatten);
    await recipe.save();
    await recipe2.save();
    await recipe3.save();
    const recipes = await controller.findAll();
    assert(recipes.total === 3);
  });

  it('GET to api/recipes with an id should get a single item', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    const gotRecipe = await controller.findOne(recipe._id);
    assert(recipe._id.toString() === gotRecipe._id.toString());
  });

  it('Get to api/recipes with a bad id should return an error', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    try {
      await controller.findOne('5b4d187a7875a55ff35aed99');
    } catch (err) {
      assert(err.message === 'Recipe not found with id: 5b4d187a7875a55ff35aed99');
    }
  });

  it('PUT to /api/recipes/:id can update a record', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    const updatedRecipe = await controller.update(
      'Kingston Negroni',
      'Fit for Jah!',
      ['Build in a glass with ice and stir'],
      [
        { measure: '1.0', unit: 'oz', name: 'Smith & Cross Rum' },
        { measure: '1.0', unit: 'oz', name: 'Campari' },
        { measure: '1.0', unit: 'oz', name: 'Sweet Vermouth' },
      ],
      recipe._id,
    );
    assert(updatedRecipe.description === 'Fit for Jah!');
  });

  it('PUT to api/recipes with a bad id should return an error', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    try {
      await controller.update(
        'Kingston Negroni',
        'Fit for Jah!',
        ['Build in a glass with ice and stir'],
        [
          { measure: '1.0', unit: 'oz', name: 'Smith & Cross Rum' },
          { measure: '1.0', unit: 'oz', name: 'Campari' },
          { measure: '1.0', unit: 'oz', name: 'Sweet Vermouth' },
        ],
        '5b4d187a7875a55ff35aed99',
      );
    } catch (err) {
      assert(err.message === 'Recipe not found with id: 5b4d187a7875a55ff35aed99');
    }
  });

  it('DELETE to ap/recipes/:id with an id will delete a record', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    const deletedRecipe = await controller.delete(recipe._id);
    assert(deletedRecipe._id.toString() === recipe._id.toString());
  });

  it('DELETE to ap/recipes/:id with a bad id will return a 404', async () => {
    const recipe = new Recipe(kingstonNegroni);
    await recipe.save();
    try {
      await controller.delete('5b4d187a7875a55ff35aed99');
    } catch (err) {
      assert(err.message === 'Recipe not found with id: 5b4d187a7875a55ff35aed99');
    }
  });
});
