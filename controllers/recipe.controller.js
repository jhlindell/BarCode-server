const Recipe = require('../models/recipe.model');
const mongoose = require('mongoose');

// Create and save a new recipe
exports.create = (name, description, instructions, ingredients) => {
  const recipe = new Recipe({
    name, description, instructions, ingredients,
  });
  const error = recipe.validateSync();
  if (error) {
    throw error;
  } else {
    return recipe.save()
      .then(data => data)
      .catch((err) => {
        throw err;
      });
  }
};

// Retrieve all recipes
exports.findAll = (page, limit, search) => {
  const query = {};
  if (search !== undefined) {
    query.name = { $regex: search, $options: 'i' };
  }
  const options = {
    page,
    limit,
    sort: { name: 1 },
  };

  return Recipe.paginate(query, options)
    .then((response) => {
      const result = Object.assign(response);
      const cleanedResult = response.docs.map((item) => {
        const cleanedItem = {
          _id: item._id,
          name: item.name,
          description: item.description,
          instructions: item.instructions,
          ingredients: item.ingredients,
        };
        return cleanedItem;
      });
      result.docs = cleanedResult;
      return result;
    }).catch((err) => {
      throw err;
    });
};

// Find a single recipe with an id
exports.findOne = (id) => {
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  return Recipe.findById(objectId)
    .then((recipe) => {
      if (recipe) {
        return recipe;
      }
      throw new Error(`Recipe not found with id: ${objectId}`);
    }).catch((err) => {
      throw err;
    });
};

// Update a stock item identified by the siId in the request
exports.update = (name, description, instructions, ingredients, id) => {
  const recipe = new Recipe({
    name,
    description,
    instructions,
    ingredients,
  });
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  const error = recipe.validateSync();
  if (error) {
    throw error;
  } else {
    return Recipe.findByIdAndUpdate(objectId, {
      name,
      description,
      instructions,
      ingredients,
    }, { new: true })
      .then((result) => {
        if (result) {
          return (result);
        }
        throw new Error(`Recipe not found with id: ${id}`);
      }).catch((err) => {
        throw err;
      });
  }
};

// Delete a recipe with the specified rId in the request
exports.delete = (id) => {
  let objectId;
  try {
    objectId = mongoose.Types.ObjectId(id);
  } catch (err) {
    throw err;
  }
  return Recipe.findByIdAndRemove(objectId)
    .then((recipe) => {
      if (recipe) {
        return recipe;
      }
      throw new Error(`Recipe not found with id: ${objectId}`);
    })
    .catch((err) => {
      throw err;
    });
};

