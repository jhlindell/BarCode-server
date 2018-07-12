const jwt = require('jwt-simple');

exports.getIdFromToken = (token) => {
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  return decodedToken.id;
};

exports.getNameFromToken = (token) => {
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  return decodedToken.username;
};
