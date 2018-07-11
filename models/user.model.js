const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
});

UserSchema.pre('save', function preHandler(next) {
  const user = this;
  const salt = bcrypt.genSaltSync();
  bcrypt.hash(user.password, salt, (err, hash) => {
    if (err) {
      next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function compareHandler(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      callback(err);
    }
    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
