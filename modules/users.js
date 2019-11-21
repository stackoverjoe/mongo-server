var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var user = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  password: { type: String, required: true }
});

user.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

user.methods.comparePassword = function(canidatePassword, cb) {
  bcrypt.compare(canidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("Users", user);
