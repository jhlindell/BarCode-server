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

const User = mongoose.model('User');

describe('authorization controller', () => {
  it('post to /signup should properly signup a user', (done) => {
    request(app)
      .post('/signup')
      .send({ username: 'Bob', email: 'Bob@foo.com', password: 'password' })
      .expect(200)
      .end(() => {
        User.findOne({ username: 'Bob' })
          .then((user) => {
            assert(user.username === 'Bob');
            done();
          })
          .catch((error) => {
            logger.info(error);
          });
      });
  });

  it('post to /signup without username should return an error', (done) => {
    request(app)
      .post('/signup')
      .send({ email: 'Bob@foo.com', password: 'password' })
      .expect(422)
      .then((response) => {
        assert(response.body.error === 'You must provide a username, email and password');
        done();
      });
  });

  it('post to /signup without email should return an error', (done) => {
    request(app)
      .post('/signup')
      .send({ username: 'Bob', password: 'password' })
      .expect(422)
      .then((response) => {
        assert(response.body.error === 'You must provide a username, email and password');
        done();
      });
  });

  it('post to /signup without password should return an error', (done) => {
    request(app)
      .post('/signup')
      .send({ username: 'Bob', email: 'Bob@foo.com' })
      .expect(422)
      .then((response) => {
        assert(response.body.error === 'You must provide a username, email and password');
        done();
      });
  });

  it('post to /signup with duplicate username should return an error', (done) => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    user.save().then(() => {
      request(app)
        .post('/signup')
        .send({ username: 'Bob', email: 'Bob@bob.com', password: 'password2' })
        .expect(422)
        .then((response) => {
          assert(response.body.error === 'username is in use');
          done();
        });
    });
  });

  it('post to /signup with duplicate email should return an error', (done) => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    user.save().then(() => {
      request(app)
        .post('/signup')
        .send({ username: 'Bobby', email: 'Bob@foo.com', password: 'password2' })
        .expect(422)
        .then((response) => {
          assert(response.body.error === 'email is in use');
          done();
        });
    });
  });

  it('post to /signin with proper credentials should return a token', (done) => {
    const user = new User({ username: 'Bob', email: 'Bob@foo.com', password: 'password' });
    user.save().then(() => {
      request(app)
        .post('/signin')
        .send({ username: 'Bob', password: 'password' })
        .expect(200)
        .then((response) => {
          assert(response.body.token);
          done();
        });
    });
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
