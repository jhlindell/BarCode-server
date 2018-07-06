const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const winston = require('winston');

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
  it('post to /api/recipes should create a recipe', (done) => {
    Recipe.count().then((count) => {
      request(app)
        .post('/api/recipes')
        .send(kingstonNegroni)
        .end(() => {
          Recipe.count().then((newCount) => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('POST to /api/recipes with incomplete object should return error message', (done) => {
    request(app)
      .post('/api/recipes')
      .send({
        name: 'Kingston Negroni',
        description: 'The best negroni variant!',
        ingredients: [],
        instructions: [
          'Build in a glass with ice and stir',
        ],
      })
      .expect(400)
      .then((response) => {
        assert(response.text === 'Recipe validation failed');
        done();
      });
  });

  it('GET to /api/stock_items should get all stock items', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    const recipe2 = new Recipe(oldFashioned);
    const recipe3 = new Recipe(manhatten);
    Promise.all([recipe.save(), recipe2.save(), recipe3.save()])
      .then(() => {
        request(app)
          .get('/api/recipes')
          .end(() => {
            Recipe.count().then((count) => {
              assert(count === 3);
              done();
            });
          });
      });
  });

  it('GET to api/recipes with an id should get a single item', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save()
      .then(() => {
        request(app)
          .get(`/api/recipes/${recipe._id}`)
          .expect(200)
          .then((response) => {
            assert(response.body._id.toString() === recipe._id.toString());
            done();
          });
      });
  });

  it('Get to api/recipes with a bad id should return an error', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save()
      .then(() => {
        request(app)
          .get('/api/recipes/asdofiansdfajklbnd')
          .expect(404)
          .then((response) => {
            const obj = JSON.parse(response.text);
            assert(obj.message === 'Recipe not found with id asdofiansdfajklbnd');
            done();
          });
      });
  });

  it('PUT to /api/recipes/:id can update a record', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save().then(() => {
      request(app)
        .put(`/api/recipes/${recipe._id}`)
        .send({
          name: 'Kingston Negroni',
          description: 'Fit for Jah!',
          ingredients: [
            { measure: '1.0', unit: 'oz', name: 'Smith & Cross Rum' },
            { measure: '1.0', unit: 'oz', name: 'Campari' },
            { measure: '1.0', unit: 'oz', name: 'Sweet Vermouth' },
          ],
          instructions: [
            'Build in a glass with ice and stir',
          ],
        })
        .expect(200)
        .end(() => {
          Recipe.findOne({ name: 'Kingston Negroni' })
            .then((response) => {
              assert(response.description === 'Fit for Jah!');
              done();
            })
            .catch((err) => {
              logger.info('ERROR: ', err);
            });
        });
    });
  });

  it('PUT to api/recipes with a bad id should return an error', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save().then(() => {
      request(app)
        .put('/api/recipes/asdofiansdfajklbnd')
        .send({
          name: 'Kingston Negroni',
          description: 'Fit for Jah!',
          ingredients: [
            { measure: '1.0', unit: 'oz', name: 'Smith & Cross Rum' },
            { measure: '1.0', unit: 'oz', name: 'Campari' },
            { measure: '1.0', unit: 'oz', name: 'Sweet Vermouth' },
          ],
          instructions: [
            'Build in a glass with ice and stir',
          ],
        })
        .expect(404)
        .then((response) => {
          const obj = JSON.parse(response.text);
          assert(obj.message === 'Item not found with id asdofiansdfajklbnd');
          done();
        });
    });
  });

  it('DELETE to ap/recipes/:id with an id will delete a record', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save().then(() => {
      request(app)
        .delete(`/api/recipes/${recipe._id}`)
        .expect(200)
        .end(() => {
          Recipe.findOne({ name: 'Kingston Negroni' })
            .then((result) => {
              assert(result === null);
              done();
            });
        });
    });
  });

  it('DELETE to ap/recipes/:id with a bad id will return a 404', (done) => {
    const recipe = new Recipe(kingstonNegroni);
    recipe.save().then(() => {
      request(app)
        .delete('/api/recipes/asdofiansdfajklbnd')
        .expect(404)
        .then((response) => {
          const obj = JSON.parse(response.text);
          assert(obj.message === 'Recipe not found with id asdofiansdfajklbnd');
          done();
        });
    });
  });
});
