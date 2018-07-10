const passport = require('passport');
const User = require('../models/user.model');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const localOptions = {};
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

const localLogin = new LocalStrategy(localOptions, ((username, password, done) => {
  // verify this username and password, call done with the user
  // if it is the correct username and password,
  // otherwise call done with false
  User.findOne({ username }, (err, user) => {
    if (err) {
      done(err);
    }
    if (!user) {
      done(null, false);
    } else {
      user.comparePassword(password, (error, isMatch) => {
        if (error) {
          done(err);
        } else if (!isMatch) {
          done(null, false);
        } else {
          done(null, user);
        }
      });
    }
  });
}));

const JwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the user id in the payload exists in the database
  // if it does, call done with that
  // otherwise, call done without a user object
  User.findById(payload.sub, (err, user) => {
    if (err) {
      done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(JwtLogin);
passport.use(localLogin);
