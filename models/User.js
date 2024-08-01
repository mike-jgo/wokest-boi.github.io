const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  dob: {
    type: String,
    validate: {
      validator: function(v) {
        return moment(v, 'YYYY-MM-DD', true).isValid();
      },
      message: props => `${props.value} is not a valid date!`
    },
    required: [true, 'Date of Birth required']
  },
  gender: String,
  username: String,
  password: String
}, { versionKey: false });

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
