const Recipe = require('../models/recipe.model');

// Create and save a new recipe
exports.create = (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
  });

  recipe.validate((err) => {
    if (err) {
      res.status(400).send(err._message);
    } else {
      recipe.save()
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          res.status(500).send({
            message: error.message || 'Some error occurred while creating the Item.',
          });
        });
    }
  });
};

// Retrieve all recipes
exports.findAll = (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  Recipe.paginate({}, { page, limit })
    .then((result) => {
      res.send(result);
    }).catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving items.',
      });
    });
};

// Find a single recipe with an id
exports.findOne = (req, res) => {
  Recipe.findById(req.params.rId)
    .then((recipe) => {
      if (!recipe) {
        res.status(404).send({
          message: `Recipe not found with id ${req.params.rId}`,
        });
      } else {
        res.send(recipe);
      }
    }).catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(404).send({
          message: `Recipe not found with id ${req.params.rId}`,
        });
      } else {
        res.status(500).send({
          message: err.message || `Error retrieving Recipe with id ${req.params.rId}`,
        });
      }
    });
};

// Update a stock item identified by the siId in the request
exports.update = (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    description: req.body.description,
    instructions: req.body.instructions,
    ingredients: req.body.ingredients,
  });
  recipe.validate((err) => {
    if (err) {
      res.status(400).send(err._message);
    } else {
      Recipe.findByIdAndUpdate(req.params.rId, {
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
        ingredients: req.body.ingredients,
      }, { new: true })
        .then((result) => {
          if (!result) {
            res.status(404).send({
              message: `Item not found with id ${req.params.rId}`,
            });
          } else {
            res.send(result);
          }
        }).catch((error) => {
          if (error.kind === 'ObjectId') {
            res.status(404).send({
              message: `Item not found with id ${req.params.rId}`,
            });
          } else {
            res.status(500).send({
              message: `Error updating item with id ${req.params.rId}`,
            });
          }
        });
    }
  });
};

// Delete a recipe with the specified rId in the request
exports.delete = (req, res) => {
  Recipe.findByIdAndRemove(req.params.rId)
    .then((recipe) => {
      if (!recipe) {
        res.status(404).send({
          message: `Recipe not found with id ${req.params.rId}`,
        });
      } else {
        res.send({ message: 'Recipe deleted successfully!' });
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        res.status(404).send({
          message: `Recipe not found with id ${req.params.rId}`,
        });
      } else {
        res.status(500).send({
          message: `Could not delete recipe with id ${req.params.rId}`,
        });
      }
    });
};
