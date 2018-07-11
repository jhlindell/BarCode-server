const User = require('../models/user.model');
const jwt = require('jwt-simple');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    id: user._id,
    iat: timestamp,
  }, process.env.JWT_SECRET);
}

exports.signin = (req, res) => {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(422).send({ error: 'You must provide a username, email and password' });
  } else {
    // see if a user with the specified email address exists
    User.findOne({ email }, (err, existingEmail) => {
      if (err) {
        next(err);
      } else if (existingEmail) {
        res.status(422).send({ error: 'email is in use' });
      } else {
        User.findOne({ username }, (err2, existingUsername) => {
          if (err2) {
            next(err2);
          } else if (existingUsername) {
            res.status(422).send({ error: 'username is in use' });
          } else {
          // if a user with email and username does NOT exist, create and save user record
            const user = new User({
              username,
              email,
              password,
            });
            user.save((error) => {
              if (error) {
                next(error);
              } else {
                // Respond to request indicating the user was created
                res.json({ token: tokenForUser(user) });
              }
            });
          }
        });
      }
    });
  }
};
