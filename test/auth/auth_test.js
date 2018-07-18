const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const winston = require('winston');
const controller = require('../../controllers/authentication');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'barcode.log' }),
  ],
});

const User = mongoose.model('User');

describe('authorization controller', () => {
  it('post to /signup should properly signup a user', async () => {
    try {
      await controller.signup('Bob', 'Bob@foo.com', 'password');
    } catch (err) {
      logger.info(`${err}`);
    }
    const user = await User.findOne({ username: 'Bob' });
    assert(user.username === 'Bob');
  });

  it('post to /signup without username should return an error', async () => {
    try {
      await controller.signup(null, 'Bob@foo.com', 'password');
    } catch (err) {
      assert(err.message === 'You must provide a username, email and password');
    }
  });

  it('post to /signup without email should return an error', async () => {
    try {
      await controller.signup('Bob', null, 'password');
    } catch (err) {
      assert(err.message === 'You must provide a username, email and password');
    }
  });

  it('post to /signup without password should return an error', async () => {
    try {
      await controller.signup('Bob', 'Bob@foo.com', null);
    } catch (err) {
      assert(err.message === 'You must provide a username, email and password');
    }
  });

  it('post to /signup with duplicate username should return an error', async () => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    await user.save();
    try {
      await controller.signup('Bob', 'Bob@bob.com', 'password2');
    } catch (err) {
      assert(err.message === 'username is in use');
    }
  });

  it('post to /signup with duplicate email should return an error', async () => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    await user.save();
    try {
      await controller.signup('Bobby', 'Bob@foo.com', 'password3');
    } catch (err) {
      assert(err.message === 'email is in use');
    }
  });

  it('post to /signin with proper credentials should return a token', async () => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    await user.save();
    const result = await controller.signin({ username: 'Bob', email: 'Bob@foo.com', _id: user._id });
    assert(result.username === 'Bob');
    assert(result.token);
  });

  it('post to /signin with bad password should return an error', (done) => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    user.save().then(() => {
      request(app)
        .post('/signin')
        .send({ username: 'Bob', password: 'passwordasdf' })
        .expect(401)
        .then((response) => {
          assert(response.error.text === 'Unauthorized');
          done();
        });
    });
  });

  it('post to /signin with bad username should return an error', (done) => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    user.save().then(() => {
      request(app)
        .post('/signin')
        .send({ username: 'Bobby', password: 'password' })
        .expect(401)
        .then((response) => {
          assert(response.error.text === 'Unauthorized');
          done();
        });
    });
  });
});
