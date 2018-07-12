const { getNameFromToken, getIdFromToken } = require('../../services/auth');
const assert = require('assert');
const jwt = require('jwt-simple');

const testUser = {
  email: 'bob@foo.com',
  username: 'Bob',
  _id: '5b45044d03b7283456247fda',
};
const timestamp = new Date().getTime();
const testToken = jwt.encode({
  id: testUser._id,
  username: testUser.username,
  iat: timestamp,
}, process.env.JWT_SECRET);

describe('auth services tests', () => {
  it('getIdFromToken method, should properly return an id from a token', () => {
    const id = getIdFromToken(testToken);
    assert(id === testUser._id);
  });

  it('getNameFromToken method should properly return name from a token', () => {
    const name = getNameFromToken(testToken);
    assert(name === testUser.username);
  });
});
