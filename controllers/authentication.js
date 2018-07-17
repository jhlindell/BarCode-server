const User = require('../models/user.model');
const jwt = require('jwt-simple');
const { getNameFromToken } = require('../services/auth');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    id: user._id,
    username: user.username,
    iat: timestamp,
  }, process.env.JWT_SECRET);
}

exports.signin = (user) => {
  const userToken = tokenForUser(user);
  return { token: userToken, username: user.username };
};

exports.signup = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error('You must provide a username, email and password');
  } else {
    try {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new Error('email is in use');
      }
    } catch (err) {
      throw err;
    }
    try {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        throw new Error('username is in use');
      }
    } catch (err) {
      throw err;
    }
    const user = new User({
      username,
      email,
      password,
    });
    try {
      await user.save();
      const object = { token: tokenForUser(user), username };
      return object;
    } catch (err) {
      throw err;
    }
  }
};

exports.username = (token) => {
  const name = getNameFromToken(token);
  return name;
};
