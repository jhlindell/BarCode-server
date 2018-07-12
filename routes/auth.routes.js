const auth = require('../controllers/authentication');
require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  app.get('/username', requireAuth, auth.username);
  app.post('/signup', auth.signup);
  app.post('/signin', requireSignin, auth.signin);
};
