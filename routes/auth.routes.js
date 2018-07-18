const auth = require('../controllers/authentication');
require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  // receives auth token from client and returns username
  app.get('/username', requireAuth, (req, res) => {
    const token = req.headers.authorization;
    const username = auth.username(token);
    res.send(username);
  });

  // processes user signup
  app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const signupResult = await auth.signup(username, email, password);
      res.send(signupResult);
    } catch (err) {
      if (err.message === 'You must provide a username, email and password' ||
          err.message === 'email is in use' ||
          err.message === 'username is in use') {
        res.status(422).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    }
  });

  // processes ser signing using auth token
  app.post('/signin', requireSignin, (req, res) => {
    const { user } = req;
    const token = auth.signin(user);
    if (token) {
      res.send(token);
    }
  });
};
