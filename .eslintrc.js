module.exports = {
    "extends": "airbnb-base",
    "env": {
      "mocha": true,
      "node": true
    },
    "rules": {
      "no-underscore-dangle": [2, { "allow": ["_id"] }],
    },
};